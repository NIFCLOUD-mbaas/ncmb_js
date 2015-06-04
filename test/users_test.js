"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");

describe("NCMB Users", function(){
  var ncmb = new NCMB();
  ncmb
  .set("apikey", config.apikey)
  .set("clientkey", config.clientkey);

  if(config.apiserver){
    ncmb
    .set("protocol", config.apiserver.protocol || "http:")
    .set("fqdn", config.apiserver.fqdn)
    .set("port", config.apiserver.port)
    .set("proxy", config.apiserver.port || "");
  }

  describe("パスワード再発行メール送信", function(){
    context("成功した場合", function(){

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.requestPasswordReset("test@example.com", function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.requestPasswordReset("test@example.com")
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("mailAddress がないときに", function(){

        it("callback で送信時エラーを取得できる", function(done){
          ncmb.User.requestPasswordReset(null, function(err, data){
            try{
              expect(err).to.be.an.instanceof(Error);
            }catch(err){
              done(err);
            }
            done();
          });
        });

        it("promise で送信時エラーを取得できる", function(done){
          ncmb.User.requestPasswordReset()
          .then(function(data){
             done(new Error("失敗すべき"));
          })
          .catch(function(err){
            try{
              expect(err).to.be.an.instanceof(Error);
            }catch(err){
              done(err);
            }
            done();
          });
        });
      });
    });
  });

  describe("ユーザー削除", function(){
    context("成功した場合", function(){
      var del_user = new ncmb.User({objectId: "object_id"});

      it("callback でレスポンスを取得できる", function(done){
        del_user.delete(function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        del_user.delete()
        .then(function(){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("ObjectId がないときに", function(){
        var del_user = new ncmb.User({});

        it("callback で削除時エラーを取得できる", function(done){
          del_user.delete(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で削除時エラーを取得できる", function(done){
          del_user.delete()
          .then(function(){
             done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });
    });
  });
});

