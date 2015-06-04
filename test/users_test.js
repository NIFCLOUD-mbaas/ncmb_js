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

  describe("ユーザー登録", function(){
    context("userName/password で登録した場合", function(){
      var name_user = null;
      beforeEach(function(){
        name_user = new ncmb.User({userName: "Yamada Tarou", password:"password"});
      });

      it("callback でレスポンスを取得できる", function(done){
        name_user.save(function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        name_user.save()
        .then(function(){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("mailAddress/password で登録した場合", function(){
      var mail_user = null;
      beforeEach(function(){
        mail_user = new ncmb.User({mailAddress: "test@example.com", password:"password"});
      });

      it("callback でレスポンスを取得できる", function(done){
        mail_user.save(function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        mail_user.save()
        .then(function(){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("authData認証を利用して", function(){
      context("Facebook で登録した場合", function(){
        var fb_user = null;
        beforeEach(function(){
          fb_user = new ncmb.User({authData: {"facebook":{"id":"100002415159782","access_token":"CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD","expiration_date":{"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}}}});
        });
        
        it("callback でレスポンスを取得できる", function(done){
          fb_user.save(function(err){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          fb_user.save()
          .then(function(){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("twitter で登録した場合", function(){
        var twi_user = null;
        beforeEach(function(){
          twi_user = new ncmb.User({authData: { "twitter": { "id": "887423302", "screen_name": "mobileBackend", "oauth_consumer_key": "ZoL16IzyCEEik4nNTEN9RW", "consumer_secret": "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk", "oauth_token": "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB","oauth_token_secret": "gye4VHfEHHBCH34cEJGiAWlukGAEJ6DCixYNU6Mg"}}});
        });
        
        it("callback でレスポンスを取得できる", function(done){
          twi_user.save(function(err){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          twi_user.save()
          .then(function(){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("Anonymous で登録した場合", function(){
        var ano_user = null;
        beforeEach(function(){
          ano_user = new ncmb.User({authData: {"anonymous":{"id":"3dc72085-911b-4798-9707-d69e879a6185"}}});
        });
       
        it("callback でレスポンスを取得できる", function(done){
          ano_user.save(function(err){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          ano_user.save()
          .then(function(){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("失敗した理由が", function(){
        context("userName or mailAddress/PWと認証情報が両方ないときに", function(){
          var non_auth_user = new ncmb.User({});

          it("callback で登録時エラーを取得できる", function(done){
            non_auth_user.save(function(err){
              if(err === null) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise で登録時エラーを取得できる", function(done){
            non_auth_user.save()
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

