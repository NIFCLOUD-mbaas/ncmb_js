"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");
var ncmb = null;

describe("NCMB Anonymous", function(){
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

  describe("login by anonymous users", function(){
    var uuid = "3dc72085-911b-4798-9707-d69e879a6185";
    var Food = null;
    var food = null;
    var data_callback_id = null;

    describe("update current user", function(){
      context("currentUser data has change", function(){
        it("callback で取得できる", function(done){
          //匿名ログインテスト
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            
            var currentUser = ncmb.User.getCurrentUser();
            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            currentUser.set("updatefield", "updated")
            .update(function(err, obj){
              if(err){
                done(err);
              }else{
                expect(data.updateDate).to.exist;
                var currentUser = ncmb.User.getCurrentUser();

                expect(currentUser.objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                expect(currentUser.userName).to.be.eql("ljmuJgf4ri");
                expect(currentUser.sessionToken).to.be.eql("esMM7OVu4PlK5spYNLLrR15io");
                expect(currentUser).to.have.property("updatefield");
                expect(currentUser.updatefield).to.be.eql("updated");
                done();
              }
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });
        });

        it("promise で取得できる", function(done){
          //匿名ログインテスト
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            
            var currentUser = ncmb.User.getCurrentUser();
            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            currentUser.set("updatefield", "updated")
            .update()
            .then(function(obj){
              expect(data.updateDate).to.exist;
              var currentUser = ncmb.User.getCurrentUser();

              expect(currentUser.objectId).to.be.eql("aTAe6VXd3ZElDtlG");
              expect(currentUser.userName).to.be.eql("ljmuJgf4ri");
              expect(currentUser.sessionToken).to.be.eql("esMM7OVu4PlK5spYNLLrR15io");
              expect(currentUser).to.have.property("updatefield");
              expect(currentUser.updatefield).to.be.eql("updated");
              done();
            })
            .catch(function(err){
              done(err);
            });


          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });
        });


      });
      
    });

    describe("create new user", function(){
      context("currentUser not change, new user is created", function(){
        it("callback で取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            console.log("Login anonymous done: "+ JSON.stringify(data));
            var currentUser = ncmb.User.getCurrentUser();
            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            var newUser = new ncmb.User({userName:"Yamada Tarou",password:"password"});
            newUser.signUpByAccount(function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.objectId).to.exist;
                // Current user not change
                expect(ncmb.User.getCurrentUser()).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
                done();
              }
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });

        it("promise で取得できる", function(done){

          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            console.log("Login anonymous done: "+ JSON.stringify(data));
            var currentUser = ncmb.User.getCurrentUser();
            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            var newUser = new ncmb.User({userName:"Yamada Tarou",password:"password"});
                newUser.signUpByAccount()
                .then(function(obj){
                  expect(obj.objectId).to.exist;
                  // Current user not change
                  expect(ncmb.User.getCurrentUser()).to.exist;
                  expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                  expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
                  done();
                })
                .catch(function(err){
                  done(err);
                });


          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });
        });
      });
    });

    describe("delete current user", function(){
      context("currentUser is deleted", function(){
        it("callback で取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            currentUser.delete(function(err){
              if(err){
                done(err);
              }else{
                expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                done();
              }
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });

        it("promise で取得できる", function(done){
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            currentUser.delete().then(function(){
              expect(ncmb.User.getCurrentUser()).to.be.eql(null);
              done();
            })
            .catch(function(err){
              done(err);
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });
      });
    });

    describe("create data object", function(){
      context("new object is created, currrentUser not change", function(){
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange", type: "fruit", status: "success"});
        });

        it("callback で削除結果を取得できる", function(done){

          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            food.save(function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.objectId).to.exist;
                data_callback_id = obj.objectId;
                // Current user not change
                expect(ncmb.User.getCurrentUser()).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
                done();
              }
            });

          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });

        it("promise で削除結果を取得できる", function(done){

          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            food.save()
            .then(function(obj){
              expect(obj.objectId).to.exist;
              data_callback_id = obj.objectId;
              // Current user not change
              expect(ncmb.User.getCurrentUser()).to.exist;
              expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
              expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
              done();
            })
            .catch(function(err){
              done(err);
            });

          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });
      });

      
    });


    describe("update data object", function(){
      context("object data is updated, currrentUser not change", function(){
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({key: "value_new"});
        });

        it("callback で取得できる", function(done){

          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            food.objectId = data_callback_id;
            food.update(function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.updateDate).to.exist;
                expect(obj).to.have.property("key");
                expect(obj.key).to.be.eql("value_new");
                // Current user not change
                expect(ncmb.User.getCurrentUser()).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
                done();
              }
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });

        it("promise で取得できる", function(done){

          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            food.objectId = data_callback_id;
            food.update()
            .then(function(obj){
              expect(obj.updateDate).to.exist;
                expect(obj).to.have.property("key");
                expect(obj.key).to.be.eql("value_new");
                // Current user not change
                expect(ncmb.User.getCurrentUser()).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
                done();
            })
            .catch(function(err){
              done(err);
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });
      });
    });


    describe("delete data object", function(){
      context("object is deleted, currrentUser not change", function(){
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food();
        });

        it("callback で取得できる", function(done){

          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            food.objectId = data_callback_id;
            food.delete(function(err){
              if(err){
                done(err);
              }else{
                // Current user not change
                expect(ncmb.User.getCurrentUser()).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
                done();
              }
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });

        it("promise で取得できる", function(done){

          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            // ログイン後処理
            var currentUser = ncmb.User.getCurrentUser();

            expect(currentUser).to.exist;
            expect(data.sessionToken).to.exist;

            food.objectId = data_callback_id;
            food.delete()
            .then(function(){
                // Current user not change
                expect(ncmb.User.getCurrentUser()).to.exist;
                expect(ncmb.User.getCurrentUser().objectId).to.be.eql("aTAe6VXd3ZElDtlG");
                expect(ncmb.User.getCurrentUser().userName).to.be.eql("ljmuJgf4ri");
                done();
            })
            .catch(function(err){
              done(err);
            });
          })
          .catch(function(err){
            // エラー処理
            console.log("Login anonymous failed: "+ JSON.stringify(err));
            done(err);
          });

        });
      });
    });

  });

});


