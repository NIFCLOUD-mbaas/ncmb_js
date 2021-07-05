"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");
var ncmb = null;

describe("NCMB Users", function(){
  var ncmb = null;
  var callback_name = "callback";
  var promise_name = "promise";
  var callback_password = "callback";
  var promise_password = "promise";
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
  });

  describe("インスタンス生成", function(){
    it("プロパティをconstructorで指定し、取得できる", function(done){
      var user = new ncmb.User({userName: "username"});
      expect(user.userName).to.be.equal("username");
      done();
    });
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

  describe("ID/PWでユーザー登録", function(){
    context("登録に成功した場合", function(){
      var name_user = null;
      beforeEach(function(){
        name_user = new ncmb.User({userName: "Yamada Tarou", password:"password"});
      });

      it("callback でレスポンスを取得できる", function(done){
        if(!ncmb.stub){
          name_user.userName = callback_name;
          name_user.password = callback_password;
        }
        name_user.signUpByAccount(function(err, obj){
          if(err){
            done(err);
          }else{
            expect(obj.objectId).to.exist;
            done();
          }
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        if(!ncmb.stub){
          name_user.userName = promise_name;
          name_user.password = promise_password;
        }
        name_user.signUpByAccount()
        .then(function(obj){
          expect(obj.objectId).to.exist;
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
            if(!err){
              done(new Error("失敗すべき"));
            }else{
              expect(err).to.be.an.instanceof(Error);
              done();
            }
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
            if(!err){
              done(new Error("失敗すべき"));
            }else{
              expect(err).to.be.an.instanceof(Error);
              done();
            }
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
    context("nullが含まれるユーザを登録に成功した場合", function(){
      var name_user = null;
      beforeEach(function(){
        name_user = new ncmb.User({userName: "Yamada Tarou", password:"password",test: null});
      });

      it("callback でレスポンスを取得できる", function(done){
        name_user.signUpByAccount(function(err, obj){
          if(err){
            done(err);
          }else{
            expect(obj.objectId).to.exist;
            done();
          }
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        name_user.signUpByAccount()
        .then(function(obj){
          expect(obj.objectId).to.exist;
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });
  });

  describe("ID/PWユーザでログイン", function(){
    var user = null;
    var userName = null;
    var password = null;
    var sessionToken = null;
    describe("login", function(){
      context("If the property has userName, password with special character: !$()*;", function(){
        beforeEach(function(){
          userName = "test";
          password = "test!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~test";
          user = new ncmb.User({userName: userName, password: password});
        });
        it("callback でレスポンスを取得できる", function(done){
          if(!ncmb.stub){
            user.userName = callback_name;
            user.password = callback_password;
          }
          user.login(function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              done();
            }
          });
        });
      });
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
          if(!ncmb.stub){
            user.userName = callback_name;
            user.password = callback_password;
          }
          user.login(function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          if(!ncmb.stub){
            user.userName = promise_name;
            user.password = promise_password;
          }
          user.login()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
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
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          user.login()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
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
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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
            userName = "name";
            user = new ncmb.User({userName: userName});
          });

          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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
            if(!ncmb.stub){
              user.userName = callback_name;
              user.password = callback_password;
            }
            ncmb.User.login(user, function(err, data){
              if(err){
                done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            if(!ncmb.stub){
              user.userName = promise_name;
              user.password = promise_password;
            }
            ncmb.User.login(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
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
              if(err){
                done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
            });
          });
          it("promise で取得できる", function(done){
            ncmb.User.login(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
              userName = "name";
              user = new ncmb.User({userName: userName});
            });

            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(user, function(err, data){
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
            if(!ncmb.stub){
              userName = callback_name;
              password = callback_password;
            }
            ncmb.User.login(userName, password, function(err, data){
              if(err){
                done(err);
              }else{
                expect(data.sessionToken).to.exist;
                done();
              }
            });
          });

          it("promise でレスポンスを取得できる", function(done){
            if(!ncmb.stub){
              userName = promise_name;
              password = promise_password;
            }
            ncmb.User.login(userName, password)
            .then(function(data){
              expect(data.sessionToken).to.exist;
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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

  (typeof window !== "undefined" ? describe.skip : describe)("Oauthでユーザー登録", function(){
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

    context("appleアカウントで登録に成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User({});
        providerData = {
          id : "100002415159782",
          access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
          client_id: "com.apple.signin-apple"
        };
        provider = "apple";
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
          };
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
          };
          provider = "Ncmb";
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

      context("Signupwith apple id error", function(){

        beforeEach(function(){
          user = new ncmb.User({});
          provider = "apple";
        });

        it("promise signUpWith apple id duplicate error", function(done){
          providerData = {
            id : "apple_duplicate_error",
            access_token: "apple_access_token_duplicate",
            client_id: "com.apple.signin-apple"
          };
          user.signUpWith(provider, providerData)
          .then(function(data){
            console.log(data);
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err.code).eql("E409001");
            expect(err.error).eql("authData is duplication.");
            done();
          });
        });

        it("promise signUpWith apple id authentication error", function(done){
          providerData = {
            id : "apple_authentication_error",
            access_token: "apple_access_token_authentication",
            client_id: "com.apple.signin-apple"
          };
          user.signUpWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err.code).eql("E401003");
            expect(err.error).eql("OAuth apple authentication error.");
            done();
          });
        });

        it("promise signUpWith apple id item settings error", function(done){
          providerData = {
            id : "apple_item_settings_error",
            access_token: "apple_access_token_item_settings",
            client_id: "com.apple.signin-apple"
          };
          user.signUpWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err.code).eql("E403005");
            expect(err.error).eql("apple must not be entered.");
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

      context("User.linkWith", function(){
        beforeEach(function(){
          user = new ncmb.User({objectId:"objectid", sessionToken:"h6dx5pQIwc0jEDt1oTtPjemPe"});
          providerData = {
            id : "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            client_id: "com.apple.signin-apple"
          };
          provider = "apple";
        });
        it("callback linkWith apple id", function(done){
          user.linkWith(provider, providerData, function(err, data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            var expectedAuthData = {"apple":providerData};
            var authDataResponse = data["authData"];
            expect(authDataResponse).to.deep.include(expectedAuthData);
            done();
          });
        });

        it("promise linkWith apple id", function(done){
          user.linkWith(provider, providerData)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            var expectedAuthData = {"apple":providerData};
            var authDataResponse = data["authData"];
            expect(authDataResponse).to.deep.include(expectedAuthData);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("User.linkWith.error", function(){
        beforeEach(function(){
          user = new ncmb.User({objectId:"objectid", sessionToken:"h6dx5pQIwc0jEDt1oTtPjemPe"});
          provider = "apple";
        });

        it("promise linkWith apple id duplicate error", function(done){
          providerData = {
            id : "apple_duplicate_error",
            access_token: "apple_access_token_duplicate",
            client_id: "com.apple.signin-apple"
          };
          user.linkWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err.code).eql("E409001");
            expect(err.error).eql("authData is duplication.");
            done();
          });
        });

        it("promise linkWith apple id authentication error", function(done){
          providerData = {
            id : "apple_authentication_error",
            access_token: "apple_access_token_authentication",
            client_id: "com.apple.signin-apple"
          };
          user.linkWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err.code).eql("E401003");
            expect(err.error).eql("OAuth apple authentication error.");
            done();
          });
        });

        it("promise linkWith apple id item settings error", function(done){
          providerData = {
            id : "apple_item_settings_error",
            access_token: "apple_access_token_item_settings",
            client_id: "com.apple.signin-apple"
          };
          user.linkWith(provider, providerData)
          .then(function(data){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err.code).eql("E403005");
            expect(err.error).eql("apple must not be entered.");
            done();
          });
        });

      });

      context("User.unLinkWith", function(){
        beforeEach(function(){
          providerData = {
            id : "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            client_id: "com.apple.signin-apple"
          };
          provider = "apple";
          var authData = {"apple":providerData};
          user = new ncmb.User({objectId:"objectid", sessionToken:"h6dx5pQIwc0jEDt1oTtPjemPe", authData:authData});
        });
        it("callback unLinkWith apple id", function(done){
          user.unLinkWith(provider, function(err, data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            var expectedAuthData = {"apple": null};
            var authDataResponse = data["authData"];
            expect(authDataResponse).to.deep.include(expectedAuthData);
            done();
          });
        });

        it("promise unLinkWith apple id", function(done){
          user.unLinkWith(provider)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            var expectedAuthData = {"apple": null};
            var authDataResponse = data["authData"];
            expect(authDataResponse).to.deep.include(expectedAuthData);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

    });
  });

  (typeof window !== "undefined" ? describe.skip : describe)("OAuthユーザでログイン", function(){
    var provider = null;
    var providerData = null;
    var user = null;
    var userName = null;
    var sessionToken = null;
    var authData = null;
    describe("loginWith", function(){
      context("provider, providerDataを入力した場合facebookログインに成功して", function(){
        beforeEach(function(){
          provider = "facebook";
          providerData = {
            id: "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          };
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData, function(err, data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("provider, providerDataを入力した場合twitterログインに成功して", function(){
        beforeEach(function(){
          provider = "twitter";
          providerData = {
            id: "887423302",
            screen_name: "mobileBackend",
            oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
            consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
            oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB",
            oauth_token_secret: "gye4VHfEHHBCH34cEJGiAWlukGAEJ6DCixYNU6Mg"
          };
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData, function(err, data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("provider, providerDataを入力した場合googleログインに成功して", function(){
        beforeEach(function(){
          provider = "google";
          providerData = {
            id:"342304547393343184783",
            access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
          };
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData, function(err, data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("provider, providerDataを入力した場合appleログインに成功して", function(){
        beforeEach(function(){
          provider = "apple";
          providerData = {
            id: "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            client_id: "com.apple.signin-apple"
          };
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData, function(err, data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith(provider, providerData)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("authDataプロパティにfacebookの認証情報があればログインに成功して", function(){
        beforeEach(function(){
          provider = "facebook";
          providerData = {
            id: "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(function(err, data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("authDataプロパティにtwitterの認証情報があればログインに成功して", function(){
        beforeEach(function(){
          provider = "twitter";
          providerData = {
            id: "887423302",
            screen_name: "mobileBackend",
            oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
            consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
            oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB",
            oauth_token_secret: "gye4VHfEHHBCH34cEJGiAWlukGAEJ6DCixYNU6Mg"
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(function(err, data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("authDataプロパティにgoogleの認証情報があればログインに成功して", function(){
        beforeEach(function(){
          provider = "google";
          providerData = {
            id:"342304547393343184783",
            access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(function(err, data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("authDataプロパティにappleの認証情報があればログインに成功して", function(){
        beforeEach(function(){
          provider = "apple";
          providerData = {
            id: "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            client_id: "com.apple.signin-apple"
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(function(err, data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith()
          .then(function(data){
            expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("authDataプロパティに複数の認証情報があれば、指定したproviderでログインに成功して", function(){
        var secondProvider = null;
        var secondProviderData = null;
        beforeEach(function(){
          provider = "facebook";
          providerData = {
            id: "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          };
          secondProvider = "google";
          secondProviderData = {
            id:"342304547393343184783",
            access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
          user.authData[secondProvider] = secondProviderData;
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(secondProvider ,function(err, data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith(secondProvider)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("authDataプロパティと<provider, providerData>入力の両方があれば、入力の認証情報でログインに成功して", function(){
        var inputProvider = null;
        var inputProviderData = null;
        beforeEach(function(){
          inputProvider = "google";
          inputProviderData = {
            id:"342304547393343184783",
            access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
          };
          provider = "facebook";
          providerData = {
            id: "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
          user.authData[inputProvider] = inputProviderData;
        });
        it("callback でレスポンスを取得できる", function(done){
          user.loginWith(inputProvider, inputProviderData, function(err, data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWith(inputProvider, inputProviderData)
          .then(function(data){
            expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("authDataプロパティと<provider, providerData>入力の両方があるが、authDataの中にない情報でログインすると失敗して", function(){
        var inputProvider = null;
        var inputProviderData = null;
        beforeEach(function(){
          provider = "google";
          providerData = {
            id:"342304547393343184783",
            access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
          };
          inputProvider = "facebook";
          inputProviderData = {
            id: "100002415159782",
            access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
            expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
        });
        it("callback でエラーを取得できる", function(done){
          user.loginWith(inputProvider, inputProviderData, function(err, data){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
        it("promise でエラーを取得できる", function(done){
          user.loginWith(inputProvider, inputProviderData)
          .then(function(data){
            done(new Error("エラーが帰って来るべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      context("authDataプロパティと<provider, providerData>入力の両方があるが、authDataの中に指摘した情報がない場合ログインすると失敗して", function(){
        var inputProvider = null;
        var inputProviderData = null;
        beforeEach(function(){
          provider = "google";
          providerData = {
            id:"342304547393343184783",
            access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
          };
          inputProvider = "google";
          inputProviderData = {
            id:"342304547393343184781",
            access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
          };
          user = new ncmb.User();
          user.authData = {};
          user.authData[provider] = providerData;
        });
        it("callback でエラーを取得できる", function(done){
          user.loginWith(inputProvider, inputProviderData, function(err, data){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
        it("promise でエラーを取得できる", function(done){
          user.loginWith(inputProvider, inputProviderData)
          .then(function(data){
            done(new Error("エラーが帰って来るべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
        beforeEach(function(){
          sessionToken = "ojUDAfEBgGadVsyQE3XO0yrtu";
          user = new ncmb.User({sessionToken: sessionToken});
        });
        it("callback で取得できる", function(done){
          user.loginWith(function(err, data){
            expect(data).to.have.property("sessionToken");
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          user.loginWith()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("失敗した理由が", function(){

        context("providerがnullだった場合", function(){
          beforeEach(function(){
            provider = null;
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("providerDataがnullだった場合", function(){
          beforeEach(function(){
            provider = "facebook";
            providerData = null;
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("providerが不正だった場合", function(){
          beforeEach(function(){
            provider = "Ncmb";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("providerDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
            };
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("authDataプロパティのproviderが不正だった場合", function(){
          beforeEach(function(){
            provider = "Ncmb";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("facebookログインでproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
            };
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("twitterログインでproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "twitter";
            providerData = {
              id: "887423302",
              screen_name: "mobileBackend",
              oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
              consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
              oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB"
            };
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("googleログインでproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "google";
            providerData = {
              access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
            };
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("appleログインでproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "apple";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
            };
            user = new ncmb.User();
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith(provider, providerData)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("facebookログインでauthDataプロパティのproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("twitterログインでauthDataプロパティのproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "twitter";
            providerData = {
              id: "887423302",
              screen_name: "mobileBackend",
              oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
              consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
              oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("googleログインでauthDataプロパティのproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "google";
            providerData = {
              access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("appleログインでauthDataプロパティのproviderDataが不正だった場合", function(){
          beforeEach(function(){
            provider = "apple";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });

        context("authDataプロパティに複数の認証情報があり、providerが指定されなかった場合", function(){
          var secondProvider = null;
          var secondProviderData = null;
          beforeEach(function(){
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            secondProvider = "google";
            secondProviderData = {
              id:"342304547393343184783",
              access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
            user.authData[secondProvider] = secondProviderData;
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginWith(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginWith()
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

    describe("User.loginWith", function(){
      context("Userのインスタンスでログインした場合", function(){
        context("authDataプロパティにfacebookの認証情報があればログインに成功して", function(){
          beforeEach(function(){
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user, function(err, data){
              expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("authDataプロパティにtwitterの認証情報があればログインに成功して", function(){
          beforeEach(function(){
            provider = "twitter";
            providerData = {
              id: "887423302",
              screen_name: "mobileBackend",
              oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
              consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
              oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB",
              oauth_token_secret: "gye4VHfEHHBCH34cEJGiAWlukGAEJ6DCixYNU6Mg"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user, function(err, data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("authDataプロパティにgoogleの認証情報があればログインに成功して", function(){
          beforeEach(function(){
            provider = "google";
            providerData = {
              id:"342304547393343184783",
              access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user, function(err, data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("authDataプロパティにappleの認証情報があればログインに成功して", function(){
          beforeEach(function(){
            provider = "apple";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              client_id: "com.apple.signin-apple"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user, function(err, data){
              expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("authDataプロパティに複数の認証情報があれば、指定したproviderでログインに成功して", function(){
          var secondProvider = null;
          var secondProviderData = null;
          beforeEach(function(){
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            secondProvider = "google";
            secondProviderData = {
              id:"342304547393343184783",
              access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
            };
            user = new ncmb.User();
            user.authData = {};
            user.authData[provider] = providerData;
            user.authData[secondProvider] = secondProviderData;
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user, secondProvider ,function(err, data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(user, secondProvider)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
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
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            user = new ncmb.User({sessionToken: sessionToken});
            user.authData = {};
            user.authData[provider] = providerData;
          });
          it("callback で取得できる", function(done){
            ncmb.User.loginWith(user, function(err, data){
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });
          it("promise で取得できる", function(done){
            ncmb.User.loginWith(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("失敗した理由が", function(){

          context("authDataプロパティのproviderが不正だった場合", function(){
            beforeEach(function(){
              provider = "Ncmb";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
                expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
              };
              user = new ncmb.User();
              user.authData = {};
              user.authData[provider] = providerData;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("facebookログインでauthDataプロパティのproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "facebook";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
              };
              user = new ncmb.User();
              user.authData = {};
              user.authData[provider] = providerData;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("twitterログインでauthDataプロパティのproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "twitter";
              providerData = {
                id: "887423302",
                screen_name: "mobileBackend",
                oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
                consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
                oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB"
              };
              user = new ncmb.User();
              user.authData = {};
              user.authData[provider] = providerData;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("googleログインでauthDataプロパティのproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "google";
              providerData = {
                access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
              };
              user = new ncmb.User();
              user.authData = {};
              user.authData[provider] = providerData;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("appleログインでauthDataプロパティのproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "apple";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
              };
              user = new ncmb.User();
              user.authData = {};
              user.authData[provider] = providerData;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("authDataプロパティに複数の認証情報があり、providerが指定されなかった場合", function(){
            var secondProvider = null;
            var secondProviderData = null;
            beforeEach(function(){
              provider = "facebook";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
                expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
              };
              secondProvider = "google";
              secondProviderData = {
                id:"342304547393343184783",
                access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
              };
              user = new ncmb.User();
              user.authData = {};
              user.authData[provider] = providerData;
              user.authData[secondProvider] = secondProviderData;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(user)
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
      context("provider, providerDateでログインした場合", function(){

        context("provider, providerDataを入力した場合facebookログインに成功して", function(){
          beforeEach(function(){
            provider = "facebook";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
            };
            user = new ncmb.User();
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData, function(err, data){
              expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("provider, providerDataを入力した場合twitterログインに成功して", function(){
          beforeEach(function(){
            provider = "twitter";
            providerData = {
              id: "887423302",
              screen_name: "mobileBackend",
              oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
              consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
              oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB",
              oauth_token_secret: "gye4VHfEHHBCH34cEJGiAWlukGAEJ6DCixYNU6Mg"
            };
            user = new ncmb.User();
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData, function(err, data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("provider, providerDataを入力した場合googleログインに成功して", function(){
          beforeEach(function(){
            provider = "google";
            providerData = {
              id:"342304547393343184783",
              access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
            };
            user = new ncmb.User();
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData, function(err, data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData)
            .then(function(data){
              expect(data).to.have.property("sessionToken", "bfHuZvZ9vXZaCfMZ7fBrRnvru");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("provider, providerDataを入力した場合appleログインに成功して", function(){
          beforeEach(function(){
            provider = "apple";
            providerData = {
              id: "100002415159782",
              access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
              client_id: "com.apple.signin-apple"
            };
            user = new ncmb.User();
          });
          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData, function(err, data){
              var currentUser = ncmb.User.getCurrentUser();
              expect(currentUser).to.have.property("objectId", "ilxN1s7foH2X4b5h");
              expect(currentUser).to.have.property("userName", "cmEFG4qlkA");
              expect(currentUser).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              var authDataResponse = currentUser.authData["apple"];
              expect(authDataResponse).to.deep.include(providerData);
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWith(provider, providerData)
            .then(function(data){
              var currentUser = ncmb.User.getCurrentUser();
              expect(currentUser).to.have.property("objectId", "ilxN1s7foH2X4b5h");
              expect(currentUser).to.have.property("userName", "cmEFG4qlkA");
              expect(currentUser).to.have.property("sessionToken", "h6dx5pQIwc0jEDt1oTtPjemPe");
              var authDataResponse = currentUser.authData["apple"];
              expect(authDataResponse).to.deep.include(providerData);
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });

        context("失敗した理由が", function(){

          context("providerがnullだった場合", function(){
            beforeEach(function(){
              provider = null;
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
                expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
              };
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("providerDataがnullだった場合", function(){
            beforeEach(function(){
              provider = "facebook";
              providerData = null;
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("providerが不正だった場合", function(){
            beforeEach(function(){
              provider = "Ncmb";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD",
                expiration_date: {"__type":"Date","iso":"2013-08-31T07:41:11.906Z"}
              };
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("providerDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "facebook";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
              };
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("facebookログインでproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "facebook";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
              };
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("twitterログインでproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "twitter";
              providerData = {
                id: "887423302",
                screen_name: "mobileBackend",
                oauth_consumer_key: "ZoL16IzyCEEik4nNTEN9RW",
                consumer_secret: "ubFWbG0wL7bub7gnWSkAKAmXj6VZ97DpmK2ZSCc5Opk",
                oauth_token: "887423106-VxW8foViKjNDOyCLcC0WhTIyxUo2r3eXLLeogUtB"
              };
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("googleログインでproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "google";
              providerData = {
                access_token:"ya29.bAoBfwXmAnEqIVVICriUsrV1BDC1BHJJj1G0-CaasIYvKs-_zFBRvnVYQ4n3NC6bFkNIYbw6vf1eXM"
              };
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });

          context("appleログインでproviderDataが不正だった場合", function(){
            beforeEach(function(){
              provider = "apple";
              providerData = {
                id: "100002415159782",
                access_token: "CAACEdEose0cBAMHWz6HxQSeXJexFhxmfC3rUswuC4G5rcKiTnzdNIRZBJnmnbjVxSAbAZBP6MXKy6gTuPZBVmUEUJ6TgdwY4sCoNNZCIuXJb4EbrJvAPrAvi1KmHXbkiArmC1pro30Eqdbt94YnNz5WsvlAeYKZCZC0ApDuKJpg41ykMuhAO6kvsudbiFkMjNRotp0yLGf1AZDZD"
              };
              user = new ncmb.User();
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWith(provider, providerData)
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginAsAnonymous(uuid)
          .then(function(data){
            expect(data.sessionToken).to.exist;
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginAsAnonymous()
          .then(function(data){
            expect(data.sessionToken).to.exist;
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginAsAnonymous()
          .then(function(data){
            expect(data.sessionToken).to.exist;
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          user.loginAsAnonymous()
          .then(function(data){
            expect(data.sessionToken).to.exist;
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("失敗した理由が", function(){
        context("uuidについて", function(){
          context("フォーマットが不正な場合(文字列の文字数が不正)", function(){
            before(function(){
              uuid = "3dc72085-911b-4798-9707";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
          context("区切り以外の記号が含まれる場合（記号）", function(){
            beforeEach(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879a61.5";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
          context("区切り以外の記号が含まれる場合（g-z）", function(){
            beforeEach(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879g6185";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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
            authData = {facebook: { id: "3dc72085-911b-4798-9707-d69e879a6185"}};
            user = new ncmb.User({authData: authData});
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginAsAnonymous(function(err, data){
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            expect(data.sessionToken).to.exist;
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }

            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data.sessionToken).to.exist;
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }

            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data.sessionToken).to.exist;
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
            if(err){
              done(err);
            }else{
              expect(data.sessionToken).to.exist;
              done();
            }

            });
          });
          it("promise で取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data.sessionToken).to.exist;
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
          context("区切り以外の記号が含まれる場合（記号）", function(){
            beforeEach(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879a61.5";
            });
            it("callback でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous( uuid, function(err, data){
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
          context("区切り以外の記号が含まれる場合（a-g）", function(){
            beforeEach(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879a61g5";
            });
            it("callback でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous( uuid, function(err, data){
                if(!err){
                  done(new Error("失敗すべき"));
                }else{
                  expect(err).to.be.an.instanceof(Error);
                  done();
                }
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
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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
            authData = {facebook: { id: "3dc72085-911b-4798-9707-d69e879a6185"}};
            user = new ncmb.User({authData: authData});
          });
          it("callback でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(!err){
                done(new Error("失敗すべき"));
              }else{
                expect(err).to.be.an.instanceof(Error);
                done();
              }
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

  (typeof window !== "undefined" ? describe.skip : describe)("ユーザー登録メール送信", function(){
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

  (typeof window !== "undefined" ? describe.skip : describe)("MAIL/PWユーザでログイン", function(){
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
            expect(data).to.have.property("sessionToken");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.loginWithMailAddress()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
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
            expect(data).to.have.property("sessionToken");
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          user.loginWithMailAddress()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
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
            mailAddress = "mail@example.com";
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
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
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
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });
          it("promise で取得できる", function(done){
            ncmb.User.loginWithMailAddress(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
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
              mailAddress = "mail@example.com";
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
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });

          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(mailAddress, password)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
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

  (typeof window !== "undefined" ? describe.skip : describe)("パスワード再発行メール送信", function(){
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

  describe("カレントユーザ確認",function(){
    var currentName = null;
    var currentPassword = null;
    describe("getCurrentUser", function(){
      context("ログイン中のユーザを取得し、", function(){
        it("存在すれば取得に成功する", function(done){
          if(!ncmb.stub){
            currentName = callback_name;
            currentPassword = callback_password;
          }else{
            currentName = "name";
            currentPassword = "passwd";
          }
          var user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              done();
            }catch(err){
              done(err);
            }
          });
        });
        it("存在しなければ null が返る", function(done){
          ncmb.User.logout(function(){
            try{
              expect(ncmb.User.getCurrentUser()).to.be.eql(null);
              done();
            }catch(err){
              done(err);
            }
          });
        });
      });
      context("非ログイン状態でローカルにcurrentUser情報が保存されているとき、", function(){
        it("カレントユーザでログイン状態になる", function(done){
          if(!ncmb.stub){
            currentName = callback_name;
            currentPassword = callback_password;
          }else{
            currentName = "name";
            currentPassword = "passwd";
          }
          var user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            ncmb.sessionToken = null;
            var currentUser = null;
            try{
              currentUser = ncmb.User.getCurrentUser();
              expect(ncmb.sessionToken).to.not.eql(null);
              expect(currentUser.userName).to.be.eql(currentName);
              done();
            }catch(err){
              done(err);
            }
          });
        });
      });
      it("取得したカレントユーザが不正なJSONの場合エラーが返る", function(done){
        var localStorage = new require("node-localstorage").LocalStorage("./scratch");
        var path = "NCMB/" + ncmb.apikey + "/currentUser";
        localStorage.setItem(path, '{"userName":aaa}');
        try{
          ncmb.User.getCurrentUser();
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("isCurrentUser", function(){
      context("インスタンスがカレントユーザか確認し、", function(){
        var user = null;
        beforeEach(function(){
          if(!ncmb.stub){
            currentName = callback_name;
            currentPassword = callback_password;
          }else{
            currentName = "name";
            currentPassword = "passwd";
          }
          user = new ncmb.User({userName:currentName,password:currentPassword});
        });
        it("カレントユーザなら true が返る", function(done){
          ncmb.User.login(user, function(err, data){
            try{
              expect(user.isCurrentUser()).to.be.eql(true);
              done();
            }catch(err){
              done(err);
            }
          });
        });
        it("カレントユーザでなければ false が返る", function(done){
          ncmb.User.logout(function(){
            try{
              expect(user.isCurrentUser()).to.be.eql(false);
              done();
            }catch(err){
              done(err);
            }
          });
        });
      });
    });
  });

  describe("ユーザ情報更新", function(){
    var user = null;
    context("成功した場合", function(){
      beforeEach(function(done){
        if(!ncmb.stub){
          user = new ncmb.User({userName:callback_name,password:callback_password});
          ncmb.User
              .login(user)
              .then(function(){
                done();
              })
              .catch(function(){
                done(new Error("前処理に失敗しました。"));
              });
        }else{
          user = new ncmb.User({ objectId:"objectid", updatefield: "updated"});
          done();
        }
      });
      it("callback でレスポンスを取得できる", function(done){
        user.update(function(err, data){
          if(err){
            done(err);
          }else{
            expect(data.updateDate).to.exist;
            done();
          }
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        user.update()
        .then(function(data){
          expect(data.updateDate).to.exist;
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });
    context("mailAddressを保持したインスタンスを更新した場合", function(){
      beforeEach(function(done){
        if(!ncmb.stub){
          user = new ncmb.User({userName:callback_name,password:callback_password,mailAddress:"test@example.com"});
          ncmb.User
              .login(user)
              .then(function(){
                done();
              })
              .catch(function(){
                done(new Error("前処理に失敗しました。"));
              });
        }else{
          user = new ncmb.User({ objectId:"objectid", mailAddress: "test@example.com"});
          done();
        }
      });
      context("mailAddressをsetし直さなければbodyに含めずにリクエストして", function(){
        it("callback でレスポンスを取得できる", function(done){
          user.set("updatefield", "updated")
              .update(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data.updateDate).to.exist;
                  done();
                }
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.set("updatefield", "updated")
              .update()
              .then(function(data){
                expect(data.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });

      context("mailAddressをsetし直したらbodyに含めてリクエストして", function(){
        it("callback でレスポンスを取得できる", function(done){
          user.set("mailAddress", "test@example.com")
              .update(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data.updateDate).to.exist;
                  done();
                }
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.set("mailAddress", "test@example.com")
              .update()
              .then(function(data){
                expect(data.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
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

  describe("ユーザーログアウト", function(){
    context("ncmb.User.logout", function(){
      context("成功した場合", function(){
        var user = null;
        beforeEach(function(){
          user = new ncmb.User({userName:"name",password:"passwd"});
        });
        it("callback でレスポンスを取得できる", function(done){
          if(!ncmb.stub){
            user.userName = callback_name;
            user.password = callback_password;
          }
          ncmb.User.login(user)
              .then(function(){
                ncmb.User.logout(function(err, res){
                  if(err){
                    done(err);
                  }else{
                    expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                    done();
                  }
                });
              })
              .catch(function(err){
                done(err);
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          if(!ncmb.stub){
            user.userName = promise_name;
            user.password = promise_password;
          }
          ncmb.User.login(user)
              .then(function(){
                return ncmb.User.logout();
              })
              .then(function(res){
                expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
    context("logout", function(){
      context("currentUserでログアウトした場合、currentUser情報ごとインスタンスのログイン情報の削除に成功し、", function(){
        var user = null;
        beforeEach(function(){
          user = new ncmb.User({userName:"name",password:"passwd"});
        });
        it("callback でレスポンスを取得できる", function(done){
          if(!ncmb.stub){
            user.userName = callback_name;
            user.password = callback_password;
          }
          ncmb.User.login(user)
              .then(function(){
                user.logout(function(err, res){
                  if(err){
                    done(err);
                  }else{
                    expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                    expect(user.sessionToken).to.be.eql(null);
                    done();
                  }
                });
              })
              .catch(function(err){
                done(err);
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          if(!ncmb.stub){
            user.userName = promise_name;
            user.password = promise_password;
          }
          ncmb.User.login(user)
              .then(function(){
                return user.logout();
              })
              .then(function(res){
                expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                expect(user.sessionToken).to.be.eql(null);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("currentUserでないログイン中のユーザでログアウトした場合、インスタンスのログイン情報のみ削除に成功し、", function(){
        var user            = null;
        var currentuser     = null;
        var subUserName     = null;
        var subUserPassword = null;
        var currentName     = null;
        var currentPassword = null;
        beforeEach(function(){
          if(ncmb.stub){
            subUserName     = "name";
            subUserPassword = "passwd";
            currentName     = "Yamada Tarou";
            currentPassword = "password";
          }else{
            subUserName     = callback_name;
            subUserPassword = callback_password;
            currentName     = promise_name;
            currentPassword = promise_password;
          }
          user = new ncmb.User({userName:subUserName,password:subUserPassword});
          currentuser = new ncmb.User({userName:currentName, password:currentPassword});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.login()
              .then(function(){
                return currentuser.login();
              })
              .then(function(){
                return ncmb.User.login(currentuser);
              })
              .then(function(){
                user.logout(function(err, res){
                  if(err){
                    done(err);
                  }else{
                    expect(ncmb.User.getCurrentUser()).to.not.eql(null);
                    expect(user.sessionToken).to.be.eql(null);
                    done();
                  }
                });
              })
              .catch(function(err){
                done(err);
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.login()
              .then(function(){
                return currentuser.login();
              })
              .then(function(){
                ncmb.User.login(currentuser);
              })
              .then(function(){
                return user.logout();
              })
              .then(function(res){
                expect(ncmb.User.getCurrentUser()).to.not.eql(null);
                expect(user.sessionToken).to.be.eql(null);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("ログイン中でないユーザでログアウトした場合エラーが返り、", function(){
        var user = null;
        beforeEach(function(){
          user = new ncmb.User({userName:"name",password:"passwd"});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.logout(function(err, res){
            if(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            }else{
              done(new Error("失敗すべき"));
            }
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.logout()
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
      it("callback でレスポンスを取得できる", function(done){
        if(ncmb.stub){
          del_user = new ncmb.User({objectId: "object_id"});
          del_user.delete(function(err){
            if(err){
              done(err);
            }else{
              done();
            }
          });
        }else{
          del_user = new ncmb.User({userName:callback_name,password:callback_password});
          ncmb.User
              .login(del_user)
              .then(function(user){
                user.delete(function(err){
                  if(err){
                    done(err);
                  }else{
                    done();
                  }
                });
              })
              .catch(function(err){
                done(err);
              });
        }
      });

      it("promise でレスポンスを取得できる", function(done){
        if(ncmb.stub){
          del_user = new ncmb.User({objectId: "object_id"});
          del_user.delete()
          .then(function(data){
            done();
          })
          .catch(function(err){
            done(err);
          });
        }else{
          del_user = new ncmb.User({userName:promise_name,password:promise_password});
          ncmb.User
              .login(del_user)
              .then(function(user){
                return user.delete();
              })
              .then(function(){
                done();
              })
              .catch(function(err){
                done(err);
              });
        }
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

  // テスト:メールアドレスの確認を行っているかどうかを判別する
  describe("isMailAddressConfirmed", function(){
    context("メールアドレスの確認を行っているかどうかを判別する", function(){
      var user = null;
      beforeEach(function(){
        user = new ncmb.User({userName:"name",password:"passwd"});
      });
      it("mailAddressConfirmが存在しない場合 falseが返る", function(){
         expect(user.isMailAddressConfirmed()).to.be.eql(false);
      });
      it("mailAddressConfirmが存在し値がnull場合 falseが返る", function(){
         user.set("mailAddressConfirm", null);
         expect(user.isMailAddressConfirmed()).to.be.eql(false);
      });
      it("mailAddressConfirmが存在し値がtrue場合 trueが返る", function(){
         user.set("mailAddressConfirm", true);
         expect(user.isMailAddressConfirmed()).to.be.eql(true);
      });
      it("mailAddressConfirmが存在し値がfalse場合 falseが返る", function(){
          user.set("mailAddressConfirm", false);
          expect(user.isMailAddressConfirmed()).to.be.eql(false);
      });
    });
  });

  describe("メールアドレス更新フラグのリセット", function () {
    var user = null;
    context("mailAddressを保持したインスタンスを更新した場合", function () {
      beforeEach(function (done) {
        if (!ncmb.stub) {
          user = new ncmb.User({ userName: "name", password: "passwd", mailAddress: "abc@example.com" });
          ncmb.User
            .login(user)
            .then(function () {
              done();
            })
            .catch(function () {
              done(new Error("前処理に失敗しました。"));
            });
        } else {
          user = new ncmb.User({ objectId: "objectid", mailAddress: "abc@example.com" });
          done();
        }
      });

      context("一度メールアドレスをsetすると以降updateのたびに更新がかかっていなくて", function () {
        it("callback でレスポンスを取得できる", function (done) {
          user.set("mailAddress", "test@example.com")
            .update(function (err, data) {
              if (err) {
                done(err);
              } else {
                user.set("updatefield", "updated")
                  .update(function (err, data) {
                    if (err) {
                      done(err);
                    } else {
                      expect(data.updateDate).to.equal("2013-08-28T12:21:17.087Z");
                      done();
                    }
                  });
              }
            });
        });
        it("promise でレスポンスを取得できる", function (done) {
          user.set("mailAddress", "test@example.com")
              .update()
              .then(function(data){
                user.set("updatefield", "updated")
                    .update()
                    .then(function(data){
                      expect(data.updateDate).to.equal("2013-08-28T12:21:17.087Z");
                      done();
                    })
                    .catch(function(err){
                      done(err);
                    });
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });

  describe("Fetch when sessionToken error", function(){
    var currentName = null;
    var currentPassword = null;
    context("Current User", function(){
      it("fetch currentUser when token error", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userDummyLogin";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            ncmb.sessionToken = null;
            user = ncmb.User.getCurrentUser();

            ncmb.User.fetchById(user.objectId)
            .then(function(obj){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err.code).eql("E401001");
              expect(err.error).eql("Authentication error by header incorrect");
              done();
            });
          }catch(err){
            done(err);
          }
        });
      });
    });
    context("Datastore", function(){
      var Drink = null;
      before(function(){
        Drink = ncmb.DataStore("drink");
      });
      it("fetch dataStore when token error", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "name";
          currentPassword = "passwd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            ncmb.sessionToken = null;

            Drink.fetch()
            .then(function(obj){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err.code).eql("E401001");
              expect(err.error).eql("Authentication error by header incorrect");
              done();
            });

          }catch(err){
            done(err);
          }
        });
      });
    });
    context("AllowUser", function(){
      it("fetch user when token error", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "name";
          currentPassword = "passwd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            ncmb.sessionToken = null;

            ncmb.User.fetchById("dummyAllowUserId")
            .then(function(obj){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err.code).eql("E401001");
              expect(err.error).eql("Authentication error by header incorrect");
              done();
            });

          }catch(err){
            done(err);
          }
        });
      });
    });
  });
  describe("Fetch when object Not found", function(){
    var currentName = null;
    var currentPassword = null;
    context("Current User", function(){
      it("fetch current user non exist after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "name";
          currentPassword = "passwd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);

            ncmb.User.fetchById("usernotfound")
            .then(function(obj){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err.code).eql("E404001");
              expect(err.error).eql("No data available.");
              done();
            });
          }catch(err){
            done(err);
          }
        });
      });
    });
    context("Datastore", function(){
      var Drink = null;
      before(function(){
        Drink = ncmb.DataStore("drinknotfound");
      });
      it("fetch object non exist after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "name";
          currentPassword = "passwd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);

            Drink.fetch()
            .then(function(obj){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err.code).eql("E404001");
              expect(err.error).eql("No data available.");
              done();
            });

          }catch(err){
            done(err);
          }
        });
      });
    });
    context("AllowUser", function(){
      it("fetch user non exist after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "name";
          currentPassword = "passwd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            ncmb.sessionToken = null;

            ncmb.User.fetchById("dummyAllowUserIdnotfound")
            .then(function(obj){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err.code).eql("E404001");
              expect(err.error).eql("No data available.");
              done();
            });

          }catch(err){
            done(err);
          }
        });
      });
    });
  });
  var data_promise_id  = null;
  describe("Login", function(){
    var currentName = null;
    var currentPassword = null;
    context("Current User", function(){
      it("fetch currentUser after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
            user = ncmb.User.getCurrentUser();

            ncmb.User.fetchById(user.objectId)
            .then(function(data){
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          }catch(err){
            done(err);
          }
        });
      });

    });

    context("Datastore", function(){
      var Food = null;
      var food = null;
      before(function(){
        Food = ncmb.DataStore("food");
        food = new Food({key: "value_new"});
      });

      it("fetch data store after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
            Food.fetch()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });

          }catch(err){
            done(err);
          }
        });
      });

      it("update data store after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
            food = new Food({key: "value_new"});
            food.objectId = "object_id";
            food.update(function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.updateDate).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              }
            });
          }catch(err){
            done(err);
          }
        });
      });

      it("add data store after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
            food = new Food({name: "orange", type: "fruit", status: "success"});
            food.save()
            .then(function(obj){
              expect(obj.objectId).to.exist;
              data_promise_id = obj.objectId;
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          }catch(err){
            done(err);
          }
        });
      });

      it("delete data store after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

            food = new Food();
            food.objectId = data_promise_id;
            food.delete()
            .then(function(){
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          }catch(err){
            done(err);
          }
        });
      });
    });

    context("AllowUser", function(){
      var name_user = null;
      beforeEach(function(){
        name_user = new ncmb.User({userName: "Yamada Tarou", password:"password"});
      });

      it("fetch allow user after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

            ncmb.User.fetchById("allowUser")
            .then(function(data){
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });

          }catch(err){
            done(err);
          }
        });
      });

      it("update allow user after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

            name_user = new ncmb.User({ objectId:"objectid", updatefield: "updated"});
            name_user.update()
            .then(function(data){
              expect(data.updateDate).to.exist;
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          }catch(err){
            done(err);
          }
        });
      });

      it("add allow user after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

            name_user.signUpByAccount()
            .then(function(obj){
              expect(obj.objectId).to.exist;
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });

          }catch(err){
            done(err);
          }
        });
      });

      it("delete not current user", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

            var del_user = null;
            del_user = new ncmb.User({objectId: "object_id"});
            del_user.delete()
            .then(function(data){
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          }catch(err){
            done(err);
          }
        });
      });
    });
  });

  describe("Login logout after that login again.", function(){
    var currentName = null;
    var currentPassword = null;
    context("Current User", function(){
      it("fetch currentUser after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);

          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              user = ncmb.User.getCurrentUser();

              ncmb.User.fetchById(user.objectId)
              .then(function(data){
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });
            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });
      });

    });

    context("Datastore", function(){
      var Food = null;
      var food = null;
      before(function(){
        Food = ncmb.DataStore("food");
        food = new Food({key: "value_new"});
      });

      it("fetch data store after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              Food.fetch()
                .then(function(obj){
                  expect(obj.objectId).to.exist;
                  expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                  expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                  expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                  done();
                })
                .catch(function(err){
                  done(err);
                });

            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

      it("update data store after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              food = new Food({key: "value_new"});
              food.objectId = "object_id";
              food.update(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.updateDate).to.exist;
                  expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                  expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                  expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                  done();
                }
              });

            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

      it("add data store after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              food = new Food({name: "orange", type: "fruit", status: "success"});
              food.save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                data_promise_id = obj.objectId;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });
            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

      it("delete data store after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

              food = new Food();
              food.objectId = data_promise_id;
              food.delete()
              .then(function(){
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });

            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

    });

    context("AllowUser", function(){
      var name_user = null;
      beforeEach(function(){
        name_user = new ncmb.User({userName: "Yamada Tarou", password:"password"});
      });

      it("fetch allow user after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

              ncmb.User.fetchById("allowUser")
              .then(function(data){
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });

            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

      it("update allow user after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

              name_user = new ncmb.User({ objectId:"objectid", updatefield: "updated"});
              name_user.update()
              .then(function(data){
                expect(data.updateDate).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });
            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

      it("add allow user after login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

              name_user.signUpByAccount()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });

            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

      it("delete not current user login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

              var del_user = null;
              del_user = new ncmb.User({objectId: "object_id"});
              del_user.delete()
              .then(function(data){
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                done();
              })
              .catch(function(err){
                done(err);
              });
            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });

    });

  });

  describe("Login", function () {
    var name_user = null;
    beforeEach(function(){
      name_user = new ncmb.User({userName: "Yamada Tarou", password:"password"});
    });
    var currentName = null;
    var currentPassword = null;
    context("Current User", function(){
      it("delete current user", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "name";
          currentPassword = "passwd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("HwwaZ60AOTdKRWyC");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("ojUDAfEBgGadVsyQE3XO0yraa");
            user = ncmb.User.getCurrentUser();
            user.delete()
            .then(function(){
              expect(ncmb.User.getCurrentUser()).to.be.eql(null);
              expect(ncmb.sessionToken).to.be.eql(null);
              done();
            })
            .catch(function(err){
              done(err);
            });
          }catch(err){
            done(err);
          }
        });
      });

      it("update currentUser after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            console.log(err);
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
            user = ncmb.User.getCurrentUser();

            user.set("updatefield", "updated")
              .update()
              .then(function(data){
                expect(data.updateDate).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
                expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
                expect(ncmb.User.getCurrentUser()).to.have.property("updatefield");
                expect(ncmb.User.getCurrentUser().updatefield).to.be.eql("updated");
                done();
              })
              .catch(function(err){
                done(err);
              });
          }catch(err){
            done(err);
          }
        });
      });

      it("update allow user after login", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "userLoginName";
          currentPassword = "userPasswd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        ncmb.User.login(user, function(err, data){
          try{
            expect(data).to.be.an.instanceof(ncmb.User);
            expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
            expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
            expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");

            name_user = new ncmb.User({ objectId:"objectid", updatefield: "updated"});
            name_user.update()
            .then(function(data){
              expect(data.updateDate).to.exist;
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("dummyCurrentUserId");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("dummySessionToken");
              expect(ncmb.User.getCurrentUser()).to.not.have.property("updatefield");
              done();
            })
            .catch(function(err){
              done(err);
            });
          }catch(err){
            done(err);
          }
        });
      });
    });
  });

  describe("Login logout after that login again.", function(){
    var currentName = null;
    var currentPassword = null;
    context("Current User", function(){
      it("delete current user login again", function(done){
        if(!ncmb.stub){
          currentName = callback_name;
          currentPassword = callback_password;
        }else{
          currentName = "name";
          currentPassword = "passwd";
        }
        var user = new ncmb.User({userName:currentName,password:currentPassword});
        // Login first time.
        ncmb.User.login(user)
        .then(function(){
          return ncmb.User.logout();
        })
        .then(function(res){
          expect(ncmb.User.getCurrentUser()).to.be.eql(null);
          // Login second time.
          user = new ncmb.User({userName:currentName,password:currentPassword});
          ncmb.User.login(user, function(err, data){
            try{
              expect(data).to.be.an.instanceof(ncmb.User);
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("HwwaZ60AOTdKRWyC");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql(currentName);
              expect(ncmb.User.getCurrentUser().sessionToken).to.be.eql("ojUDAfEBgGadVsyQE3XO0yraa");
              user = ncmb.User.getCurrentUser();
              user.delete()
              .then(function(){
                expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                done();
              })
              .catch(function(err){
                done(err);
              });
            }catch(err){
              done(err);
            }
          });
        })
        .catch(function(err){
          done(err);
        });

      });
    });
  });

});
