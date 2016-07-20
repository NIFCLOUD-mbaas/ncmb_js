"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Relation", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey);
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol)
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "")
          .set("stub", config.apiserver.stub);
    }
  });

  var data_callback_id  = null;
  var data_promise_id   = null;
  var data_related_id   = null;
  var user_callback_id  = null;
  var user_promise_id   = null;
  var user_related_id   = null;
  var role_callback_id  = null;
  var role_promise_id   = null;
  var role_related_id   = null;
  var array_callback_id = null;
  var array_promise_id  = null;
  var array_related1_id = null;
  var array_related2_id = null;

  describe("リレーションの追加", function(){
    var relation = null;
    var MainObj  = null;
    var mainobj  = null;
    describe("add", function(){
      context("Data型のオブジェクトをリレーションに追加して保存し、レスポンスを", function(){
        var Food = null;
        var food = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange", type: "fruit", status: "success"});
        });
        it("callback で取得できる", function(done){
          relation.add(food);
          mainobj.relation = relation;
          mainobj.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.have.property("objectId");
              expect(food).to.have.property("objectId");
              data_callback_id = obj.objectId;
              data_related_id  = food.objectId;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          food.objectId = data_related_id;
          relation.add(food);
          mainobj.relation = relation;
          mainobj.save()
                 .then(function(obj){
                   expect(obj).to.have.property("objectId");
                   expect(food).to.have.property("objectId");
                   data_promise_id = obj.objectId;
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      context("User型のオブジェクトをリレーションに追加して保存し、レスポンスを", function(){
        var subuser = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          subuser = new ncmb.User({userName:"Yamada Tarou", password:"password"});
        });
        it("callback で取得できる", function(done){
          relation.add(subuser);
          mainobj.relation = relation;
          mainobj.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.have.property("objectId");
              expect(subuser).to.have.property("objectId");
              user_callback_id = obj.objectId;
              user_related_id = subuser.objectId;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          subuser.objectId = user_related_id;
          relation.add(subuser);
          mainobj.relation = relation;
          mainobj.save()
                 .then(function(obj){
                   expect(obj).to.have.property("objectId");
                   expect(subuser).to.have.property("objectId");
                   user_promise_id = obj.objectId;
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      context("Role型のオブジェクトをリレーションに追加して保存し、レスポンスを", function(){
        var subrole = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          subrole = new ncmb.Role("role_name");
        });
        it("callback で取得できる", function(done){
          relation.add(subrole);
          mainobj.relation = relation;
          mainobj.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.have.property("objectId");
              expect(subrole).to.have.property("objectId");
              role_related_id = subrole.objectId;
              role_callback_id = obj.objectId;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          subrole.objectId = role_related_id;
          relation.add(subrole);
          mainobj.relation = relation;
          mainobj.save()
                 .then(function(obj){
                   expect(obj).to.have.property("objectId");
                   expect(subrole).to.have.property("objectId");
                   role_promise_id = obj.objectId;
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      context("複数のオブジェクトを配列で追加して保存し、レスポンスを", function(){
        var Food = null;
        var food1 = null;
        var food2 = null;
        var array = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          Food = ncmb.DataStore("food");
          food1 = new Food({name: "orange", type: "fruit", status: "success"});
          food2 = new Food({name: "apple", type: "fruit", status: "success"});
          array = [food1, food2];
        });
        it("callback で取得できる", function(done){
          relation.add(array);
          mainobj.relation = relation;
          mainobj.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.have.property("objectId");
              expect(food1).to.have.property("objectId");
              expect(food2).to.have.property("objectId");
              array_related1_id = food1.objectId;
              array_related2_id = food2.objectId;
              array_callback_id = obj.objectId;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          food1.objectId = array_related1_id;
          food2.objectId = array_related2_id;
          relation.add(array);
          mainobj.relation = relation;
          mainobj.save()
                 .then(function(obj){
                   expect(obj).to.have.property("objectId");
                   expect(food1).to.have.property("objectId");
                   expect(food2).to.have.property("objectId");
                   array_promise_id = obj.objectId;
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      it("登録する配列内のオブジェクトのクラスが異なる場合、登録に失敗する", function(done){
        var Food = ncmb.DataStore("food");
        var Drink = ncmb.DataStore("drink");
        var food = new Food({name: "orange", status: "success"});
        var drink = new Drink({name: "milk", status: "success"});
        var relation = new ncmb.Relation();
        var array = [food, drink];
        try{
          relation.add(array);
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("複数回実行することで、登録オブジェクトを追加できる", function(done){
        var Food = ncmb.DataStore("food");
        var food1 = new Food({name: "orange", type: "fruit", status: "success"});
        var food2 = new Food({name: "apple", type: "fruit", status: "success"});
        var relation = new ncmb.Relation();
        relation.add(food1)
                .add(food2);
        try{
          expect(relation.objects.length).to.be.eql(2);
          done();
        }catch(err){
          done(err);
        }
      });
      it("追加したオブジェクトのクラスが異なる場合、登録に失敗する", function(done){
        var Food = ncmb.DataStore("food");
        var Drink = ncmb.DataStore("drink");
        var food = new Food({name: "orange", status: "success"});
        var drink = new Drink({name: "milk", status: "success"});
        var relation = new ncmb.Relation();
        relation.add(food);
        try{
          relation.add(drink);
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("追加したオブジェクトがncmbのオブジェクトでない場合、登録に失敗する", function(done){
        var relation = new ncmb.Relation();
        try{
          relation.add({name: "orange", status: "success"});
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("ncmb.Userオブジェクトを追加できる", function(done){
        var user = new ncmb.User({userName:"name", password:"passwd"});
        var relation = new ncmb.Relation("user");
        try{
          relation.add(user);
          done();
        }catch(err){
          done(err);
        }
      });
      it("ncmb.Roleオブジェクトを追加できる", function(done){
        var role = new ncmb.Role("rolename");
        var relation = new ncmb.Relation("role");
        try{
          relation.add(role);
          done();
        }catch(err){
          done(err);
        }
      });
      context("インスタンス生成時にリレーションを生成するクラス名を指定し、", function(){
        var Food = null;
        var food = null;
        var relation = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food([{name: "orange", type: "fruit", status: "success"}]);
        });
        it("指定したクラスのインスタンスを追加できる", function(done){
          relation = new ncmb.Relation("food");
          try{
            relation.add(food);
            done();
          }catch(err){
            done(err);
          }
        });
        it("指定したクラス以外のインスタンスを追加するとエラーが返る", function(done){
          relation = new ncmb.Relation("drink");
          try{
            relation.add(food);
            done(new Error("失敗すべき"));
          }catch(err){
            done();
          }
        });
      });
    });
  });
  describe("リレーションの削除", function(){
    var relation = null;
    var MainObj  = null;
    var mainobj  = null;
    describe("remove", function(){
      context("Data型のオブジェクトをリレーションから削除して保存し、レスポンスを", function(){
        var Food = null;
        var food = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          if(ncmb.stub) data_callback_id = data_promise_id = "remove_id";
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange", type: "fruit", status: "success"});
          food.objectId = data_related_id;
        });
        it("callback で取得できる", function(done){
          mainobj.objectId = data_callback_id;
          relation.remove(food);
          mainobj.relation = relation;
          mainobj.update(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.eql(data_callback_id);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          mainobj.objectId = data_promise_id;
          relation.remove(food);
          mainobj.relation = relation;
          mainobj.update()
                 .then(function(obj){
                   expect(obj.objectId).to.be.eql(data_promise_id);
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      context("User型のオブジェクトをリレーションから削除して保存し、レスポンスを", function(){
        var subuser = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          if(ncmb.stub) user_callback_id = user_promise_id = "remove_user_id";
          subuser = new ncmb.User({userName:"Yamada Tarou", password:"password"});
          subuser.objectId = user_related_id;
        });
        it("callback で取得できる", function(done){
          mainobj.objectId = user_callback_id;
          relation.remove(subuser);
          mainobj.relation = relation;
          mainobj.update(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.eql(user_callback_id);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          mainobj.objectId = user_promise_id;
          relation.remove(subuser);
          mainobj.relation = relation;
          mainobj.update()
                 .then(function(obj){
                   expect(obj.objectId).to.be.eql(user_promise_id);
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      context("Role型のオブジェクトをリレーションから削除して保存し、レスポンスを", function(){
        var subrole = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          if(ncmb.stub) role_callback_id = role_promise_id = "remove_role_id";
          subrole = new ncmb.Role("role_name");
          subrole.objectId = role_related_id;
        });
        it("callback で取得できる", function(done){
          mainobj.objectId = role_callback_id;
          relation.remove(subrole);
          mainobj.relation = relation;
          mainobj.update(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.eql(role_callback_id);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          mainobj.objectId = role_promise_id;
          relation.remove(subrole);
          mainobj.relation = relation;
          mainobj.update()
                 .then(function(obj){
                   expect(obj.objectId).to.be.eql(role_promise_id);
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      context("リレーションから削除する複数のオブジェクトを配列で指定して保存し、レスポンスを", function(){
        var Food = null;
        var food1 = null;
        var food2 = null;
        var array = null;
        beforeEach(function(){
          relation = new ncmb.Relation();
          MainObj = ncmb.DataStore("MainObj");
          mainobj = new MainObj();
          if(ncmb.stub) array_callback_id = array_promise_id = "remove_multi_id";
          Food = ncmb.DataStore("food");
          food1 = new Food({name: "orange", type: "fruit", status: "success"});
          food2 = new Food({name: "apple", type: "fruit", status: "success"});
          food1.objectId = array_related1_id;
          food2.objectId = array_related2_id;
          array = [food1, food2];
        });
        it("callback で取得できる", function(done){
          mainobj.objectId = array_callback_id;
          relation.remove(array);
          mainobj.relation = relation;
          mainobj.update(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.eql(array_callback_id);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          mainobj.objectId = array_promise_id;
          relation.remove(array);
          mainobj.relation = relation;
          mainobj.update()
                 .then(function(obj){
                   expect(obj.objectId).to.be.eql(array_promise_id);
                   done();
                 })
                 .catch(function(err){
                   done(err);
                 });
        });
      });
      it("登録する配列内のオブジェクトのクラスが異なる場合、登録に失敗する", function(done){
        var Food = ncmb.DataStore("food");
        var Drink = ncmb.DataStore("drink");
        var food = new Food({name: "orange", status: "success"});
        var drink = new Drink({name: "milk", status: "success"});
        var relation = new ncmb.Relation();
        var array = [food, drink];
        try{
          relation.remove(array);
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("複数回実行することで、削除するオブジェクトを追加できる", function(done){
        var Food = ncmb.DataStore("food");
        var food1 = new Food({name: "orange", type: "fruit", status: "success"});
        var food2 = new Food({name: "apple", type: "fruit", status: "success"});
        var relation = new ncmb.Relation();
        relation.remove(food1)
                .remove(food2);
        try{
          expect(relation.objects.length).to.be.eql(2);
          done();
        }catch(err){
          done(err);
        }
      });
      it("追加したオブジェクトのクラスが異なる場合、登録に失敗する", function(done){
        var Food = ncmb.DataStore("food");
        var Drink = ncmb.DataStore("drink");
        var food = new Food({name: "orange", status: "success"});
        var drink = new Drink({name: "milk", status: "success"});
        var relation = new ncmb.Relation();
        relation.remove(food);
        try{
          relation.remove(drink);
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      context("インスタンス生成時にリレーション要素を削除するクラス名を指定し、", function(){
        var Food = null;
        var food = null;
        var relation = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange", type: "fruit", status: "success"});
        });
        it("指定したクラスのインスタンスを追加できる", function(done){
          relation = new ncmb.Relation("food");
          try{
            relation.remove(food);
            done();
          }catch(err){
            done(err);
          }
        });
        it("指定したクラス以外のインスタンスを追加するとエラーが返る", function(done){
          relation = new ncmb.Relation("drink");
          try{
            relation.remove(food);
            done(new Error("失敗すべき"));
          }catch(err){
            done();
          }
        });
      });
    });
  });
});
