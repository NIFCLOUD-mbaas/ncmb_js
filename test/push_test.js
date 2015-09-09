"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Push", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.port || "");
    }
  });
  var push = null;
  describe("インスタンス生成", function(){
    it("プロパティをconstructorで指定できる", function(done){
      push = new ncmb.Push({immediateDeliveryFlag: true});
      expect(push.immediateDeliveryFlag).to.be.eql(true);
      done();
    });
    it("変更できないプロパティを指定するとエラーが返る", function(done){
      try{
        push = new ncmb.Push({send: true});
        done(new Error("失敗すべき"));
      }catch(err){
        done();
      };
    });
  });
  describe("プッシュ送信", function(){
    context("プッシュ通知を送信したとき、送信に成功して", function(){
      beforeEach(function(){
        push = new ncmb.Push({immediateDeliveryFlag: true});
      });
      it("callback で取得できる", function(done){
        push.send(function(err, obj){
          if(err){
            done(err);
          }else{
            expect(obj.objectId).to.be.eql("push_id");
            done();
          }
        });
      });
      it("promise で取得できる", function(done){
        
        push.send()
            .then(function(obj){
              expect(obj.objectId).to.be.eql("push_id");
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });
  });

  describe("プッシュ検索", function(){
    context("プッシュ通知を検索したとき、取得に成功して", function(){
      it("callback で取得できる", function(done){
        ncmb.Push.fetchAll(function(err, objs){
          if(err){
            done(err);
          }else{
            expect(objs.length).to.be.equal(1);
            expect(objs[0].target[0]).to.be.equal("ios");
            done();
          }
        });
      });
      it("promise で取得できる", function(done){
        ncmb.Push.fetchAll()
            .then(function(objs){
              expect(objs.length).to.be.equal(1);
              expect(objs[0].target[0]).to.be.equal("ios");
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });
  });
});
