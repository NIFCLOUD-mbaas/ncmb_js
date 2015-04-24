"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB DataStore", function(){
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

  describe("オブジェクト登録", function(){
    describe("save", function(){
      context("クラス定義が存在すれば、登録に成功し", function(){
        var Food = ncmb.DataStore("food");
        var food = new Food({name: "orange", type: "fruit", status: "success"});
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          food.save()
              .then(function(newFood){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });

      context("クラス定義が存在しなければ、登録に失敗し", function(){
        var NonExist = ncmb.DataStore("nonexist");
        var food = new NonExist({name: "orange", type: "fruit", status: "failure"});
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            expect(err.status).to.be.eql(400);
            done();
          });
        });
        it("promise で取得できる", function(done){
          food.save()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                done();
              });
        });
      });
    });
  });

 
  describe("オブジェクト更新", function(){
    describe("クラスからオブジェクトを更新", function(){

      context("update成功", function(){
        var Food = ncmb.DataStore("food");
        var food = new Food({objectId: "object_id", key: "new_value"});

        it("callback で取得できる", function(done){
          food.update(function(err, obj){
            done(err ? err : null);
          });
        });

        it("promise で取得できる", function(done){
          food.update()
              .then(function(newFood){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });

      context("update失敗_objectIdがない理由で", function(){
        var Food = ncmb.DataStore("food");
        var food = new Food({key: "new_value"});

        it("callback で取得できる", function(done){
          food.update(function(err, obj){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で取得できる", function(done){
          food.update()
              .then(function(newFood){
                done(new Error("Must throw error"));
              })
              .catch(function(err){
                console.log(err);
                done();
              });
        });
      });

    });
  });
  describe("オブジェクト削除", function(){
  });
  describe("オブジェクト検索", function(){
    describe("fetchAll", function(){
      context("クラス定義が存在しなければ、取得に失敗しエラーが返り", function(){
        var Food = ncmb.DataStore("bizarrefruit");
        it("callback で補足できる", function(done){
          Food.fetchAll(function(err, objs){
            if(err){
              return done();
            }else{
              return done(new Error("エラーが返ってきていない"));
            }
          });
        });
        it("promise で補足できる", function(done){
          Food.fetchAll()
              .then(function(foods){
                done(new Error("エラーが返ってきていない"));
              })
              .catch(function(err){
                return done();
              });
        });
      });
      context("クラス定義が存在し、データがなければ、空のリストが返り", function(){
        var NonExist = ncmb.DataStore("nonexist");
        var food = new NonExist({name: "orange", type: "fruit", status: "failure"});
        it("callback で取得できる");
        it("promise で取得できる");
      });
      context("クラス定義が存在し、データがあれば、リストが返り", function(){
        var NonExist = ncmb.DataStore("nonexist");
        var food = new NonExist({name: "orange", type: "fruit", status: "failure"});
        it("callback で取得できる");
        it("promise で取得できる");
      });
    });
  });
});
