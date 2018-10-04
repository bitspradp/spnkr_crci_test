const chai = require('chai'),
      expect = chai.expect,
      //redis = require('../redis.js'),
      sinon = require('sinon');
      db  = require('../db.js');
let sandbox = sinon.createSandbox();

describe('db', () => {
    //let getDomainNodeInfoStub, mockDomain;
    let initialMockTestMethodStub;
    /*
    'xmchosttype', data.type, 'xmchost',
                    data.address, 'xmcport', data.port, 'xmcuserpassword', data.userpassword, 'xmcuserid', data.userid,
                    'xmchostid', data.id
     */
    beforeEach(() => {
        /*mockDomain = {
            xmchosttype : 'xmc server',
            xmchost: '10.177.222.84',
            xmcport: 8443,
            xmcuserpassword: 'Extreme_123',
            xmcuserid: 'root',
            xmchostid: 'xmc_84'
        };
        getDomainNodeInfoStub = sandbox.stub(redis, 'hgetall').resolves(mockDomain);*/
        initialMockTestMethodStub =  sandbox.stub(db, 'initialMockTestMethod').returns("New Input");


    });

    afterEach(() =>{
        sandbox.restore();
    });

    /*context('get', () => {
        it('call getDomainNodeInfo with domainNodeId and return mockDomain',(done) => {
            db.getDomainNodeInfo('xmc_84',function (err, result) {
                expect(err).to.be.null;
                expect(getDomainNodeInfoStub).to.have.been.calledWith('xmc_84');
                expect(result).to.be.a('object');
                expect(result).to.have.property('xmchost').to.equal('10.177.222.84');
                getDomainNodeInfoStub.restore();
                done();
            });
        });
    });*/
    context('test initialMockTestMethod',() => {
        it('call initialMockTestMethod with input and return mock value new input', () =>
        {
            db.initialMockTestMethod('input', function (err, result) {
                expect(err).to.be.null;
                expect(initialMockTestMethodStub).to.have.been.calledWith('input');
                expect(result).to.equal("New Input");
                initialMockTestMethodStub.restore();
                //done();
            });
        });
    });
});