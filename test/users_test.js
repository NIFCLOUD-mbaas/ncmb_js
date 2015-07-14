"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");
var ncmb = null;

describe("NCMB User", function(){
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

  describe("Oauthログイン", function(){
    var user = null;
    var providerData = null;
    var provider = null;
    context("facebookログインに成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User({});
        providerData = {
          id : "100002415159782",
          access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
          expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
        };
        provider = "facebook";
      });
      it("callback でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData, function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData)
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("twitterログインに成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User({});
        providerData = { 
          "id": "887423302", 
          "screen_name": "mobileBackend", 
          "oauth_consumer_key": "ZoL16IzyCEEik4nNTEN9RW", 
          "consumer_secret": "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk", 
          "oauth_token": "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB",
          "oauth_token_secret": "gye4VHfEHHBCH34cEJGiAWlukGAEJ6DCixYNU6Mg"
        };
        provider = "twitter";
      });
      it("callback でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData, function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData)
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("googleログインに成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User({});
        providerData = { 
          "id":"342304547393343184783", 
          "access_token":"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM" 
        };
        provider = "google";
      });
      it("callback でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData, function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData)
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("provider名がなかった場合", function(){
        beforeEach(function(){
          user = new ncmb.User({});
          providerData = {
            id : "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          }
          provider = null;
        });
        it("callback で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error); 
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      context("provider名が不正だった場合", function(){
        beforeEach(function(){
          user = new ncmb.User({});
          providerData = {
            id : "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          }
          provider = "nifty";
        });
        it("callback で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error); 
            console.log("err:", err);
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      context("認証情報がなかった場合", function(){
        beforeEach(function(){
          user = new ncmb.User({});
          providerData = null;
          provider = "facebook";
        });
        it("callback で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error); 
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });
      context("認証情報が不足していた場合", function(){
        beforeEach(function(){
          user = new ncmb.User({});
          providerData = {
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          };
          provider = "facebook";
        });
        it("callback で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error); 
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          user.signUpWith(provider, providerData)
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

  describe("ユーザ情報更新", function(){
    var user = null;
    context("成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User({ objectId:"objectid", updatefield: "updated"});
      });
      it("callback でレスポンスを取得できる", function(done){
        user.update(function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.update()
        .then(function(data){
          expect(data).to.have.property("updateDate", "2013-08-28T12:21:17.087Z");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("objectId がないときに", function(){
        beforeEach(function(){
          user = new ncmb.User({updatefield: "updated"});
        });

        it("callback で更新時エラーを取得できる", function(done){
          user.update(function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error); 
            done();
          });
        });

        it("promise で更新時エラーを取得できる", function(done){
          user.update()
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

