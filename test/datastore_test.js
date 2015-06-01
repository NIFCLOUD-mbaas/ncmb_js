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
  describe("オブジェクト取得", function(){
    describe("fetch", function(){
      it("fetch");
      it("fetchById");
    });
    describe("fetchById", function(){
      it("fetch");
      it("fetchById");
    });
  });
  describe("オブジェクト更新", function(){
  });
  describe("オブジェクト削除", function(){
  });

  describe("オブジェクト複数操作", function(){
    describe("saveAll", function(){

      context("saveAll (2 objects) 成功", function(){
        var Food = ncmb.DataStore("food");
        var food1 = new Food({key: "value1"});
        var food2 = new Food({key: "value2"});

        it("saveAll (callback取得できる)", function(done){
          Food.saveAll([food1, food2], function(err, list){
              if(err) {
                done(err);
              } else {
                expect(list[0].objectId).to.be.eql("food_id1");
                expect(list[1].objectId).to.be.eql("food_id2");
                done();
              }
          });
        });

        it("saveAll (promise取得できる)", function(done){
          Food.saveAll([food1, food2])
                .then(function(list){
                  expect(list[0].objectId).to.be.eql("food_id1");
                  expect(list[1].objectId).to.be.eql("food_id2");
                  done();
                })
                .catch(function(err){
                  done(err);
                });
        });

        it("saveAll (60 objects)", function(done){
          var arr = [];
          for(var i = 0; i<60; i++) {
            arr.push(food1);
          }
          Food.saveAll(arr, function(err, list){
            if(err) {
              done(err);
            } else {
              expect(list[0].objectId).to.be.eql("nsgVyp0UyXQYTjbU");
              done();
            }
          });
        });

      });
      
      context("saveAll 失敗", function(){
        var Food = ncmb.DataStore("food");

        it("saveAll (callback取得できる)", function(done){
          Food.saveAll([], function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("saveAll (promise取得できる)", function(done){
          Food.saveAll([])
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

    describe("updateAll", function(){
       it("updateAll (callback取得できる)");
       it("updateAll (promise取得できる)");
    });

    describe("deleteAll", function(){
       it("deleteAll (callback取得できる)");
       it("deleteAll (promise取得できる)");
    });

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
