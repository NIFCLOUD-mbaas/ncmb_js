"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");
var ncmb = null;

describe("NCMB Users", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB();
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
  });

  describe("ログイン", function(){
    var user = null;
    context("userName, password でログインした場合", function(){
      beforeEach(function(){
        user = new ncmb.User({userName:"name", password:"passwd"});
      });

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.login(user, function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.login(user)
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });
    
    context("mailAddress, password でログインした場合", function(){
      beforeEach(function(){
        user = new ncmb.User({mailAddress:"test@example.com", password:"passwd"});
      });

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.login(user, function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.login(user)
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("username, mailAddress, password がない場合", function(){
        beforeEach(function(){
          user = new ncmb.User();
        });
       
        it("callback でログインエラーを取得できる", function(done){
          ncmb.User.login(user, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise でログインエラーを取得できる", function(done){
          ncmb.User.login(user)
          .then(function(data){
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


  describe("パスワード再発行メール送信", function(){
    var user = null;
    context("成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User({ mailAddress: "test@example.com" });
      });
      it("callback でレスポンスを取得できる", function(done){
        user.requestPasswordReset(function(err, data){
          done(err ? err : null);
        });
      });
      it("promise でレスポンスを取得できる", function(done){
        user.requestPasswordReset()
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
        beforeEach(function(){
          user = new ncmb.User({});
        });

        it("callback で送信時エラーを取得できる", function(done){
          user.requestPasswordReset(function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error); 
            done();
          });
        });

        it("promise で送信時エラーを取得できる", function(done){
          user.requestPasswordReset()
          .then(function(data){
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

  describe("ログアウト", function(){
    var LocalStorage = null;
    var localStorage = null;
    before(function(){
      LocalStorage = require("node-localstorage").LocalStorage;
      localStorage = new LocalStorage('./scratch');
    });

    context("成功した場合", function(){
      beforeEach(function(done){
        localStorage.setItem("NCMB/" +  ncmb.apikey + "/currentUser", '{"userName":"tes","password":"aaa","objectId":"objectid"}');
        localStorage.setItem("NCMB/" +  ncmb.apikey + "/sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
        ncmb.sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
        setTimeout(function(){
          done();
        }, 1900);
      });
      afterEach(function(done){
        if(localStorage.getItem("NCMB/" +  ncmb.apikey + "/currentUser")){
          localStorage.removeItem("NCMB/" +  ncmb.apikey + "/currentUser");
        }
        if(localStorage.getItem("NCMB/" +  ncmb.apikey + "/sessionToken")){
          localStorage.removeItem("NCMB/" +  ncmb.apikey + "/sessionToken");
        }
        delete ncmb.sessionToken;
        setTimeout(function(){
          done();
        }, 1900);
      });

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.logout(function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.logout()
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("ログインしていないとき", function(){
        beforeEach(function(done){
          if(localStorage.getItem("NCMB/" +  ncmb.apikey + "/currentUser")){
            localStorage.removeItem("NCMB/" +  ncmb.apikey + "/currentUser");
          }
          if(localStorage.getItem("NCMB/" +  ncmb.apikey + "/sessionToken")){
            localStorage.removeItem("NCMB/" +  ncmb.apikey + "/sessionToken");
          }
          delete ncmb.sessionToken;
          setTimeout(function(){
          done();
        }, 1900);
        });

        it("callback でログアウトエラーを取得できる", function(done){
          ncmb.User.logout(function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise でログアウトエラーを取得できる", function(done){
          ncmb.User.logout()
          .then(function(data){
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

  describe("ユーザー削除", function(){
    var del_user = null;
    context("成功した場合", function(){
      beforeEach(function(){
        del_user = new ncmb.User({objectId: "object_id"});
      });

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
          expect(err).to.be.an.instanceof(Error);
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("ObjectId がないときに", function(){
        beforeEach(function(){
          del_user = new ncmb.User({});
        });

        it("callback で削除時エラーを取得できる", function(done){
          del_user.delete(function(err){
            if(!err) done(new Error("失敗すべき"));
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

