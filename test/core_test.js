"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB core", function(){
  var ncmb = null;

  before(function(done){done();});
  after(function(done){done();});
  describe("signature 作成", function(){
    it("[公式ドキュメント](http://bit.ly/1GsvAKL) の通りに成功する", function(){
      ncmb = new NCMB();
      ncmb
        .set("apikey", "6145f91061916580c742f806bab67649d10f45920246ff459404c46f00ff3e56")
        .set("clientkey", "1343d198b510a0315db1c03f3aa0e32418b7a743f8e4b47cbff670601345cf75");

      var sig = ncmb.createSignature(
        "https://"+ncmb.fqdn+"/" + ncmb.version +"/classes/TestClass",
        "GET",
        {where: {testKey: "testValue"}},
        "2013-12-02T02:44:35.452Z"
      );
      expect(sig).to.be.equal("/mQAJJfMHx2XN9mPZ9bDWR9VIeftZ97ntzDIRw0MQ4M=");
    });
  });

  describe("低レベル リクエスト API", function(){
    var ncmb = new NCMB();
    ncmb
      .set("apikey", config.apikey)
      .set("clientkey", config.clientkey);
    if(config.apiserver){
      ncmb
        .set("protocol", config.apiserver.protocol || "http:")
        .set("fqdn", config.apiserver.fqdn)
        .set("port", config.apiserver.port)
        .set("proxy", config.apiserver.proxy || "");
    }

    it("callback によりデータを取得できる", function(done){
      ncmb.request({
        path: "/"+ncmb.version+"/classes/TestClass",
        timestamp: "2015-02-25T08:01:08.908Z"
      }, function(err, res, body){
        if(err) return done(err);
        return done();
      });
    });
    it("promise によりデータを取得できる", function(done){
      ncmb.request({
        path: "/"+ncmb.version+"/classes/TestClass",
        timestamp: "2015-02-25T08:01:08.908Z"
      })
      .then(function(body){
        done();
      })
      .catch(function(err){
        done(err);
      });
    });
  });
});
