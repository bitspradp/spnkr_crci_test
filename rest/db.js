const request = require('request'),
redis = require('./redis.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var populateSites =  function(data, hostdata) {
    const rootNode = data.data.network.siteTree,
          hostXmcId = hostdata.xmchostid;

    redis.client.hmset('siteId:' + hostXmcId + ':' + rootNode.id, ['location',
        rootNode.location, 'siteId' , rootNode.id, 'siteIdKey', 'siteId:' + hostXmcId + ':' +
        rootNode.id, 'name', rootNode.name, 'leaf', rootNode.leaf ],function(err, resp) {
        if (err)
            console.log(err);
    });
    redis.client.hset('xmchostid:' + hostXmcId,['rootSite', 'siteId:' + hostXmcId + ':' + rootNode.id]);
    rootNode.devIdList.forEach((devId) => {
        redis.client.sadd('siteId:' + hostXmcId + ':' + rootNode.id +
        ':devList', 'devId:' + hostXmcId + ':' + devId);
    });
    processSiteChilren(hostXmcId,rootNode,rootNode.children);
};

var processSiteChilren = function (xmcSiteId,rootNode,children) {
    children.forEach((rootNodeChildren) => {
        redis.client.hmset('siteId:' + xmcSiteId+ ':' + rootNodeChildren.id, ['location',
                rootNodeChildren.location, 'siteId', rootNodeChildren.id, 'siteIdKey', 'siteId:' +xmcSiteId+ ':'+
                rootNodeChildren.id, 'rootNodeChildren', rootNodeChildren.name, 'leaf', rootNodeChildren.leaf],
            function (err, resp) {
                if (err)
                    console.log(err);
            }
        );
        rootNodeChildren.devIdList.forEach((devId) => {
            redis.client.sadd('siteId:' + xmcSiteId+ ':'  + rootNodeChildren.id +
            ':devList', 'devId:' + xmcSiteId + ':' +devId);
        });

        redis.client.lpush('siteId:' + xmcSiteId + ':' + rootNode.id + ':children', 'siteId:' + xmcSiteId+ ':'  + rootNodeChildren.id);
        if (rootNodeChildren.children) {

            processSiteChilren(xmcSiteId, rootNodeChildren, rootNodeChildren.children);

        }
    });
};
var populateDeviceData =  function(data,nodeInfo) {
    var devData = data.data.network.devices;
    if(devData) {
        devData.forEach((elem) =>  {
            redis.client.hmset('devId:'+ nodeInfo.xmchostid + ':' + elem.deviceId, ['ip',
                elem.ip, 'deviceName' ,elem.deviceName, 'sitePath',
                elem.sitePath, 'deviceIdKey', 'devId:'+ elem.deviceId],
            function(err, resp){
                if(err)
                    console.log(err);
            });

        });
    }

};
/*
        redis.client.hmset('xmchosts:id:' + data.xmchostid, ['xmchosttype', data.xmchosttype, 'xmchost',
            data.xmchost,'xmcport', data.xmcport, 'xmcuserpassword', data.xmcuserpassword, 'xmcuserid',data.xmcuserid]);
 */

var loadXmcHostData = (data) => {
    let auth = "Basic " + new Buffer(data.xmcuserid + ":" + data.xmcuserpassword).toString("base64"),
        host = data.xmchost,
        port = data.xmcport;
    request.post({
        headers: {
            'content-type': 'application/json',
            'Authorization': auth
        },
        //rejectUnauthorized: false,
        url: 'https://' + host + ':' + port + '/nbi/graphql',
        body: '{"query" : "{network {siteTree}}"}'
    }, function (error, response, body) {
        var jsonResp = JSON.parse(body);
        populateSites(jsonResp,data);
        //console.log(jsonResp);
    });
};

var loadDeviceData = (data) => {
    let auth = "Basic " + new Buffer(data.xmcuserid + ":" + data.xmcuserpassword).toString("base64"),
        host = data.xmchost,
        port = data.xmcport;
    request.post({
        headers: {
            'content-type': 'application/json',
            'Authorization': auth
        },
        //rejectUnauthorized: false,
        url: 'https://' + host + ':' + port + '/nbi/graphql',
        body: '{"query" : "{network {devices{ip deviceId deviceName sitePath siteId }}}"}'
    }, function (error, response, body) {
        var jsonResp = JSON.parse(body);
        populateDeviceData(jsonResp,data);
        //console.log(jsonResp);
    });
};
var addXmcHost = (data) => {
    if(data) {
        redis.client.hmset('xmchosts:id:' + data.xmchostid, ['xmchosttype', data.xmchosttype, 'xmchost',
            data.xmchost,'xmcport', data.xmcport, 'xmcuserpassword', data.xmcuserpassword, 'xmcuserid',data.xmcuserid]);
        redis.client.sadd('xmchosts', data.xmchostid);
    }
    loadXmcHostData(data);
    loadDeviceData(data);
};
module.exports.addXmcHost = addXmcHost;


