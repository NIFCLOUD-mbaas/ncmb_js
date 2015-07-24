"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");
var ncmb = null;

describe("NCMB Users", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
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
    var userName = null;
    var password = null;
    context("ncmb.Userのインスタンスでログインした場合", function(){
      beforeEach(function(){
        user = new ncmb.User({userName:"name", password:"passwd"});
      });

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.login(user, function(err, data){
          expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.login(user)
        .then(function(data){
          expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });
    
    context("userName, password でログインした場合", function(){
      beforeEach(function(){
        userName  = "name";
        password = "passwd";
      });

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.login(userName, password, function(err, data){
          expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.login(userName, password)
        .then(function(data){
          expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("username プロパティがない場合", function(){
        beforeEach(function(){
          user = new ncmb.User({userName:"name"});
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
      context("password プロパティがない場合", function(){
        beforeEach(function(){
          user = new ncmb.User({password:"passwd"});
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

      context("usernameの値がない場合", function(){
        beforeEach(function(){
          userName  = null;
          password = "passwd";
        });
       
        it("callback でログインエラーを取得できる", function(done){
          ncmb.User.login(userName, password, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise でログインエラーを取得できる", function(done){
          ncmb.User.login(userName, password)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });
      context("passwordの値がない場合", function(){
        beforeEach(function(){
          userName  = "name";
          password = null;
        });
       
        it("callback でログインエラーを取得できる", function(done){
          ncmb.User.login(userName, password, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise でログインエラーを取得できる", function(done){
          ncmb.User.login(userName, password)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });
      context("userName/passwordログインで引数が足りない場合", function(){
        beforeEach(function(){
          userName  = "name";
        });
       
        it("callback でログインエラーを取得できる", function(done){
          ncmb.User.login(userName, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise でログインエラーを取得できる", function(done){
          ncmb.User.login(userName)
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

  describe("匿名ユーザでログイン", function(){
    var uuid = null;
    context("成功した場合", function(){
      beforeEach(function(){
        uuid = "3dc72085-911b-4798-9707-d69e879a6185";
      });
      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.loginAsAnonymous( uuid, function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.loginAsAnonymous(uuid)
        .then(function(data){
          expect(data).to.have.property("updateDate", "2013-08-16T11:49:45.108Z");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("uuidについて", function(){
      context("フォーマットが不正な場合", function(){
        beforeEach(function(){
          uuid = "3dc72085-911b-4798-9707";
        });
        it("callback でログイン時エラーを取得できる", function(done){
          ncmb.User.loginAsAnonymous( uuid, function(err, data){
            if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
          });
        });

        it("promise でログイン時エラーを取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });
      context("大文字のアルファベットが含まれる場合", function(){
        beforeEach(function(){
          uuid = "3dc72085-911b-4798-9707-d69e879A6185";
        });
        it("callback でログイン時エラーを取得できる", function(done){
          ncmb.User.loginAsAnonymous( uuid, function(err, data){
            if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
          });
        });

        it("promise でログイン時エラーを取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });
      context("区切り以外の記号が含まれる場合", function(){
        beforeEach(function(){
          uuid = "3dc72085-911b-4798-9707-d69e879a61.5";
        });
        it("callback でログイン時エラーを取得できる", function(done){
          ncmb.User.loginAsAnonymous( uuid, function(err, data){
            if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
          });
        });

        it("promise でログイン時エラーを取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
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

