"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var signature = require("../lib/signature");
var NCMB = require("../lib/ncmb");
var ncmb = null;

(typeof window !== "undefined" ? describe.skip : describe)("NCMB signature", function(){
  describe("create", function(){
    var name_user = null;
    before(function(){
      ncmb = new NCMB(config.apikey, config.clientkey );
      if(config.apiserver){
        ncmb
        .set("protocol", config.apiserver.protocol)
        .set("fqdn", config.apiserver.fqdn)
        .set("port", config.apiserver.port)
        .set("proxy", config.apiserver.proxy || "")
        .set("stub", config.apiserver.stub);
      }
      name_user = new ncmb.User({userName: "Yamada Tarou", password:"password"});
    });
    it("[公式ドキュメント](http://bit.ly/1GsvAKL) の通りに成功する", function(){
      var sig = signature.create(
        "https://mbaas.api.nifcloud.com/2013-09-01/classes/TestClass",
        "GET",
        {where: {testKey: "testValue"}},
        "2013-12-02T02:44:35.452Z",
        "HmacSHA256", 2,
        "mbaas.api.nifcloud.com",
        "6145f91061916580c742f806bab67649d10f45920246ff459404c46f00ff3e56",
        "1343d198b510a0315db1c03f3aa0e32418b7a743f8e4b47cbff670601345cf75"
      );
      expect(sig).to.be.equal("AltGkQgXurEV7u0qMd+87ud7BKuueldoCjaMgVc9Bes=");
    });
    it("レスポンスシグネチャチェック", function(done){
      ncmb.enableResponseValidation(true);
      ncmb.request({
        path: "/" + ncmb.version + "/users",
        method: "POST",
        data: name_user,
        timestamp: "2017-11-16T09:56:28.373Z"
      }).then(function(data){
        ncmb.enableResponseValidation(false);
        var obj = null;
        try{
          obj = JSON.parse(data);
        }catch(err){
          throw err;
        }
        if(obj == null) return done("Null response data");
        done();
        return name_user;
      }.bind(name_user)).catch(function(err){
        if(err) return done(err);
        throw err;
      });

    });
  });
});
