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

  describe("インスタンス生成", function(){
    it("プロパティをconstructorで指定し、取得できる", function(done){
      var user = new ncmb.User({userName: "username"});
      expect(user.userName).to.be.equal("username");
      done();
    })
    it("変更許可のないキーを指定した場合、値を変更できない", function(done){
      var user = new ncmb.User({save: "overwrite"});
      try{
        expect(user.save).to.be.equal("overwrite");
        done(new Error("失敗すべき"));
      }catch(err){
        done();
      }
    });
  });

  describe("ID/PWユーザでログイン", function(){
    var user = null;
    var userName = null;
    var password = null;
    var sessionToken = null;
    describe("login", function(){
      context("プロパティにuserName, passwordがあればログインに成功して", function(){
        beforeEach(function(){
          userName = "name";
          password = "passwd";
          user = new ncmb.User({userName: userName, password: password});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.login(function(err, data){
            expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.login()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
        beforeEach(function(){
          sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
          user = new ncmb.User({sessionToken: sessionToken});
        });
        it("callback で取得できる", function(done){
          user.login(function(err, data){
            expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          user.login()
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
            password = "passwd";
            user = new ncmb.User({password: password});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
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
            userName = "name"
            user = new ncmb.User({userName: userName});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("username プロパティの値がない場合", function(){
          beforeEach(function(){
            userName  = null;
            password = "passwd";
            user = new ncmb.User({userName: userName, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("password プロパティの値がない場合", function(){
          beforeEach(function(){
            userName  = "name";
            password = null;
            user = new ncmb.User({userName: userName, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
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

    describe("User.login", function(){
      context("ncmb.Userのインスタンスでログインした場合", function(){
        context("プロパティにuserName, passwordがあればログインに成功して", function(){
          beforeEach(function(){
            userName = "name";
            password = "passwd";
            user = new ncmb.User({userName: userName, password: password});
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
        context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
          beforeEach(function(){
            userName = "name";
            password = "passwd";
            sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
            user = new ncmb.User({userName: userName, password: password, sessionToken: sessionToken});
          });
          it("callback で取得できる", function(done){
            ncmb.User.login(user, function(err, data){
              expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
              done(err ? err : null);
            });
          });
          it("promise で取得できる", function(done){
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
        context("失敗した理由が", function(){
          context("username プロパティがない場合", function(){
            beforeEach(function(){
              password = "passwd";
              user = new ncmb.User({password: password});
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
              userName = "name"
              user = new ncmb.User({userName: userName});
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
          context("username プロパティの値がない場合", function(){
            beforeEach(function(){
              userName  = null;
              password = "passwd";
              user = new ncmb.User({userName: userName, password: password}); 
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
          context("password プロパティの値がない場合", function(){
            beforeEach(function(){
              userName  = "name";
              password = null;
              user = new ncmb.User({userName: userName, password: password}); 
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
      
      context("userName, password でログインした場合", function(){
        context("userName, passwordが存在すればログインに成功して", function(){
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
          context("引数が足りない場合", function(){
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
    });
  });

  describe("MAIL/PWユーザでログイン", function(){
    var user = null;
    var mailAddress = null;
    var password = null;
    var sessionToken = null;
    describe("loginWithMailAddress", function(){
      context("プロパティにmailAddress, passwordがあればログインに成功して", function(){
        beforeEach(function(){
          mailAddress = "mail@example.com";
          password = "passwd";
          user = new ncmb.User({mailAddress: mailAddress, password: password});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWithMailAddress(function(err, data){
            expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWithMailAddress()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
        beforeEach(function(){
          sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
          user = new ncmb.User({sessionToken: sessionToken});
        });
        it("callback で取得できる", function(done){
          user.loginWithMailAddress(function(err, data){
            expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          user.loginWithMailAddress()
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
        context("mailAddress プロパティがない場合", function(){
          beforeEach(function(){
            password = "passwd";
            user = new ncmb.User({password: password});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
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
            mailAddress = "mail@example.com"
            user = new ncmb.User({mailAddress: mailAddress});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("mailAddress プロパティの値がない場合", function(){
          beforeEach(function(){
            mailAddress  = null;
            password = "passwd";
            user = new ncmb.User({mailAddress: mailAddress, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("password プロパティの値がない場合", function(){
          beforeEach(function(){
            mailAddress  = "mail@example.com";
            password = null;
            user = new ncmb.User({mailAddress: mailAddress, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
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

    describe("User.loginWithMailAddress", function(){
      context("ncmb.Userのインスタンスでログインした場合", function(){
        context("プロパティにmailAddress, passwordがあればログインに成功して", function(){
          beforeEach(function(){
            mailAddress = "mail@example.com";
            password = "passwd";
            user = new ncmb.User({mailAddress: mailAddress, password: password});
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(user, function(err, data){
              expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
          beforeEach(function(){
            mailAddress = "mail@example.com";
            password = "passwd";
            sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
            user = new ncmb.User({mailAddress: mailAddress, password: password, sessionToken: sessionToken});
          });
          it("callback で取得できる", function(done){
            ncmb.User.loginWithMailAddress(user, function(err, data){
              expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
              done(err ? err : null);
            });
          });
          it("promise で取得できる", function(done){
            ncmb.User.loginWithMailAddress(user)
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
          context("mailAddress プロパティがない場合", function(){
            beforeEach(function(){
              password = "passwd";
              user = new ncmb.User({password: password});
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
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
              mailAddress = "mail@example.com"
              user = new ncmb.User({mailAddress: mailAddress});
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("mailAddress プロパティの値がない場合", function(){
            beforeEach(function(){
              mailAddress  = null;
              password = "passwd";
              user = new ncmb.User({mailAddress: mailAddress, password: password}); 
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("password プロパティの値がない場合", function(){
            beforeEach(function(){
              mailAddress  = "mail@example.com";
              password = null;
              user = new ncmb.User({mailAddress: mailAddress, password: password}); 
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
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
      
      context("mailAddress, password でログインした場合", function(){
        context("mailAddress, passwordが存在すればログインに成功して", function(){
          beforeEach(function(){
            mailAddress  = "mail@example.com";
            password = "passwd";
          });

          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(mailAddress, password, function(err, data){
              expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
              done(err ? err : null);
            });
          });

          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(mailAddress, password)
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
          context("mailAddressの値がない場合", function(){
            beforeEach(function(){
              mailAddress  = null;
              password = "passwd";
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password)
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
              mailAddress  = "mail@example.com";
              password = null;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password)
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
    });
  });

  describe("匿名ユーザでログイン", function(){
    var uuid = null;
    var user = null;
    var userName = null;
    var sessionToken = null;
    var authData = null;
    describe("loginAsAnonymous", function(){
      context("uuidを入力した場合ログインに成功して", function(){
        beforeEach(function(){
          uuid = "3dc72085-911b-4798-9707-d69e879a6185";
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginAsAnonymous(uuid, function(err, data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginAsAnonymous(uuid)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにuuidがあればログインに成功して", function(){
        beforeEach(function(){
          uuid = "3dc72085-911b-4798-9707-d69e879a6185";
          user = new ncmb.User({uuid: uuid});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginAsAnonymous(function(err, data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginAsAnonymous()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにanonymousのauthDataがあればログインに成功して", function(){
        beforeEach(function(){
          authData = {anonymous: { id: "3dc72085-911b-4798-9707-d69e879a6185"}};
          user = new ncmb.User({authData: authData});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginAsAnonymous(function(err, data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginAsAnonymous()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
        beforeEach(function(){
          sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
          user = new ncmb.User({sessionToken: sessionToken});
        });
        it("callback で取得できる", function(done){
          user.loginAsAnonymous(function(err, data){
            expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          user.loginAsAnonymous()
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
        context("uuidについて", function(){
          context("フォーマットが不正な場合", function(){
            before(function(){
              uuid = "3dc72085-911b-4798-9707";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous(uuid)
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
            before(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879A6185";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous(uuid)
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
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous(uuid)
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
        context("usernameログインと競合した場合", function(){
          beforeEach(function(){
            userName = "name";
            user = new ncmb.User({userName: userName});
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginAsAnonymous(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginAsAnonymous()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("anonymous以外のauthDataログインと競合した場合", function(){
          beforeEach(function(){
            authData = {facebook: { id: "3dc72085-911b-4798-9707-d69e879a6185"}}
            user = new ncmb.User({authData: authData});
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginAsAnonymous(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginAsAnonymous()
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
    describe("User.loginAsAnonymous", function(){
      context("uuidを入力した場合ログインに成功して", function(){
        beforeEach(function(){
          uuid = "3dc72085-911b-4798-9707-d69e879a6185";
        });
        it("callback でレスポンスを取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid, function(err, data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("ncmb.Userのインスタンスを入力した場合", function(){
        context("プロパティにuuidがあればログインに成功して", function(){
          beforeEach(function(){
            uuid = "3dc72085-911b-4798-9707-d69e879a6185";
            user = new ncmb.User({uuid: uuid});
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("プロパティにanonymousのauthDataがあればログインに成功して", function(){
          beforeEach(function(){
            authData = {anonymous: { id: "3dc72085-911b-4798-9707-d69e879a6185"}};
            user = new ncmb.User({authData: authData});
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "esMM7OVu4PlK5spYNLLrR15io");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
          beforeEach(function(){
            sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
            user = new ncmb.User({sessionToken: sessionToken});
          });
          it("callback で取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
              done(err ? err : null);
            });
          });
          it("promise で取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "ojUDAfEBgGadVsyQE3XO0yrtu");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
      });

      context("失敗した理由が", function(){
        context("uuidについて", function(){
          context("フォーマットが不正な場合", function(){
            before(function(){
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
            before(function(){
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
        context("usernameログインと競合した場合", function(){
          beforeEach(function(){
            userName = "name";
            user = new ncmb.User({userName: userName});
          });
          it("callback でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("anonymous以外のauthDataログインと競合した場合", function(){
          beforeEach(function(){
            authData = {facebook: { id: "3dc72085-911b-4798-9707-d69e879a6185"}}
            user = new ncmb.User({authData: authData});
          });
          it("callback でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
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

  describe("ID/PWでユーザー登録", function(){
    context("登録に成功した場合", function(){
      var name_user = null;
      beforeEach(function(){
        name_user = new ncmb.User({userName: "Yamada Tarou", password:"password"});
      });

      it("callback でレスポンスを取得できる", function(done){
        name_user.signUpByAccount(function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        name_user.signUpByAccount()
        .then(function(){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      var noName_user = null;
      context("userName がないときに", function(){
        beforeEach(function(){
          noName_user = new ncmb.User({password: "password"});
        });

        it("callback で登録時エラーを取得できる", function(done){
          noName_user.signUpByAccount(function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          noName_user.signUpByAccount()
          .then(function(){
             done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      var noPass_user = null;
      context("password がないときに", function(){
        beforeEach(function(){
          noPass_user = new ncmb.User({userName: "Tarou"});
        });

        it("callback で登録時エラーを取得できる", function(done){
          noPass_user.signUpByAccount(function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          noPass_user.signUpByAccount()
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

  describe("Oauthでユーザー登録", function(){
    var user = null;
    var providerData = null;
    var provider = null;
    context("facebookアカウントで登録に成功した場合", function(){
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
          expect(data).to.have.property("objectId", "ilxN1s7foH2X4b5h");
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData)
        .then(function(data){
          expect(data).to.have.property("objectId", "ilxN1s7foH2X4b5h");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("twitterアカウントで登録に成功した場合", function(){
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
          expect(data).to.have.property("objectId", "gUtxyRGbqJaWeeGc");
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData)
        .then(function(data){
          expect(data).to.have.property("objectId", "gUtxyRGbqJaWeeGc");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("googleアカウントで登録に成功した場合", function(){
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
          expect(data).to.have.property("objectId", "gUtxyRGbqJaWeeGc");
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData)
        .then(function(data){
          expect(data).to.have.property("objectId", "gUtxyRGbqJaWeeGc");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("authDataプロパティを直接設定した場合ログインに成功して", function(){
      beforeEach(function(){
        providerData = { 
          "id":"342304547393343184783", 
          "access_token":"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM" 
        };
        user = new ncmb.User({authData: {google: providerData}});
      });
      it("callback でレスポンスを取得できる", function(done){
        user.signUpWith(function(err, data){
          expect(data).to.have.property("objectId", "gUtxyRGbqJaWeeGc");
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.signUpWith(provider, providerData)
        .then(function(data){
          expect(data).to.have.property("objectId", "gUtxyRGbqJaWeeGc");
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
      context("ID/PWログインと競合した場合", function(){
        beforeEach(function(){
          user = new ncmb.User({userName:"username"});
          providerData = {
            id : "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          }
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

  describe("ユーザー登録メール送信", function(){
    context("成功した場合", function(){

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.requestSignUpEmail("test@example.com", function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.requestSignUpEmail("test@example.com")
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
          ncmb.User.requestSignUpEmail(null, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で送信時エラーを取得できる", function(done){
          ncmb.User.requestSignUpEmail()
          .then(function(data){
             done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

    context("mailAddress が登録済みのときに", function(){

      it("callback で送信時エラーを取得できる", function(done){
        ncmb.User.requestSignUpEmail("usedaddress@example.com", function(err, data){
          if(!err) done(new Error("失敗すべき"));
          expect(err).to.be.an.instanceof(Error);
          done();
        });
      });

      it("promise で送信時エラーを取得できる", function(done){
        ncmb.User.requestSignUpEmail("usedaddress@example.com")
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

  describe("更新オペレーション設定", function(){
    var user = null;
    context("setIncrement", function(){
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとamountを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.setIncrement("key", 2);
        expect(user.key).to.be.eql({__op:"Increment", amount: 2});
        done();
      });
      it("keyのみを指定した場合、keyのプロパティにamountが1のオペレーションを設定できる", function(done){
        user.setIncrement("key");
        expect(user.key).to.be.eql({__op:"Increment", amount: 1});
        done();
      });
      it("複数回実行した場合、amountが各入力値の合計値のオペレーションを設定できる", function(done){
        user.setIncrement("key", 3);
        user.setIncrement("key", 2);
        expect(user.key).to.be.eql({__op:"Increment", amount: 5});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.setIncrement("key", 3).setIncrement("key");
        expect(user.key).to.be.eql({__op:"Increment", amount: 4});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.add("key", ["apple"]).setIncrement("key");
        expect(user.key).to.be.eql({__op:"Increment", amount: 1});
        done();
      });
      it("amountがnumber以外のとき、エラーが返る", function(done){
        expect(function(){
          user.setIncrement("key","1");
        }).to.throw(Error);
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.setIncrement("save",1);
        }).to.throw(Error);
        done();
      });
    });
    context("add", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.add("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.add("key", 1);
        expect(user.key).to.be.eql({__op:"Add", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.add("key", [1,2,3]);
        user.add("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.add("key", [1,2,3]).add("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.remove("key", ["apple"]).add("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.add("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.add("key");
        }).to.throw(Error);
        done();
      });
    });
    context("addUnique", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.addUnique("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.addUnique("key", 1);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.addUnique("key", [1,2,3]);
        user.addUnique("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.addUnique("key", [1,2,3]).addUnique("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.remove("key", ["apple"]).addUnique("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("key");
        }).to.throw(Error);
        done();
      });
      it("重複する値が入力されたとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("key",[1,2,3])
              .addUnique("key",1);
        }).to.throw(Error);
        done();
      });
    });
    context("remove", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.remove("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.remove("key", 1);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.remove("key", [1,2,3]);
        user.remove("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.remove("key", [1,2,3]).remove("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.add("key", ["apple"]).remove("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.remove("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.remove("key");
        }).to.throw(Error);
        done();
      });
    });
  });
});
