const express = require('express'),
  process = require('process'),
  bodyParser = require('body-parser'),
  redis = require('./redis.js'),
  db = require('./db.js');

var app = express();
// parse application/json
app.use(bodyParser.json());
/*app.use((req, res, next) => {
  console.time('request');
  next();
});*/

app.get('/deviceDataForSite/:siteId', (req, res) => {
    var siteId = req.params.siteId + ':devList';
    redis.smembers(siteId).then((data)=>Promise.all(data.map((val)=>{
        return redis.hgetall(val);
    }))).then((data)=>{
        console.log(data);
        res.send(data)
    });
    //redis.smembers(siteId).then((data)=>Promise.all(data.map(redis.hgetall))).then((data)=>res.send(data));

});

var getChildren = function(node) {

    return Promise.resolve().then(function() {
    node.children = [];
    return redis.lrange(node.siteIdKey + ':children').then(function (data) {
        return Promise.all(data.map(redis.hgetall)).then(function(data) {
            return Promise.all(data.map(function(val) {
                node.children.push(val);
                return getChildren(val);
            }));

        });
    })});
    //return node;
};

app.get('/xmchosts', (req, res) => {
    var hosts = [];
    redis.smembers('xmchosts').then((data)=>Promise.all(data.map((data)=>{
        let host = {hostid : data};
        //return redis.hgetall(val);
        return redis.hget('xmchosts:id:' + data, 'xmchosttype').then(function (data) {
            host.sitetype = data;
            hosts.push(host);
        });
    }))).then((data)=>{
        console.log(data);
        res.send(hosts)
    });
});

app.get('/sites/:hostId', (req, res) => {
    let returnData = {};
    var hostId = req.params.hostId;
    redis.hget('xmchostid:' + hostId, 'rootSite').then(function (data) {
        redis.hgetall(data).then(function (data) {
            //returnData.push(getChildren(data));
            let node = data;
            getChildren(node).then(function (data) {
                res.send(node);
            });
        });
    });
    //})));
    //res.send(returnData);
});

app.post('/xmchost', (req, res) => {
    var data = req.body;
    //console.log(data);
    db.addXmcHost(data);
    res.status(200).send('OK');
});

app.listen(6080,'0.0.0.0');
//app.listen(3000);
//redis.smembers("sites").then((data)=>Promise.all(data.map(redis.hgetall))).then((data)=>res.send(data));
//redis.smembers("sites").then((data)=>Promise.all(data.map(function (data) {