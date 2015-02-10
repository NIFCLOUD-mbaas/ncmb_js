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
    context("クラス定義が存在すれば、登録に成功し", function(){
      var Food = ncmb.DataStore("food");
      var food = new Food({name: "orange", type: "fruit", status: "success"});
      it("callback で取得できる", function(done){
        food.save(function(err, res, newFood){
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
        food.save(function(err, res, newNonExist){
          expect(res.statusCode).to.be.gte(400);
          done(err ? err : null);
        });
      });
      it("promise で取得できる", function(done){
        food.save()
          .then(function(newNonExist){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            done();
          });
      });
    });
  });
  describe("オブジェクト取得", function(){
    it("fetch");
    it("fetchById");
  });
  describe("オブジェクト更新", function(){
  });
  describe("オブジェクト削除", function(){
  });
  describe("オブジェクト検索", function(){
    context("クラス定義が存在しなければ、取得に失敗しエラーが返り", function(){
      var Food = ncmb.DataStore("food");
      it("callback で補足できる", function(done){
        Food.fetchAll(function(err, res, foods){
          console.log(foods[0].className)
          done(err ? err : null);
        });
      });
      it("promise で補足できる", function(done){
        Food.fetchAll()
          .then(function(foods){
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("クラス定義が存在し、データがなければ、空のリストが返り", function(){
      var NonExist = ncmb.DataStore("nonexist");
      var food = new NonExist({name: "orange", type: "fruit", status: "failure"});
      it("callback で取得できる", function(done){
        food.save(function(err, res, newNonExist){
          expect(res.statusCode).to.be.gte(400);
          done(err ? err : null);
        });
      });
      it("promise で取得できる", function(done){
        food.save()
          .then(function(newNonExist){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            done();
          });
      });
    });
    context("クラス定義が存在し、データがあれば、リストが返り", function(){
      var NonExist = ncmb.DataStore("nonexist");
      var food = new NonExist({name: "orange", type: "fruit", status: "failure"});
      it("callback で取得できる", function(done){
        food.save(function(err, res, newNonExist){
          expect(res.statusCode).to.be.gte(400);
          done(err ? err : null);
        });
      });
      it("promise で取得できる", function(done){
        food.save()
          .then(function(newNonExist){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            done();
          });
      });
    });
  });
});
