"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB DataStore", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB();
    ncmb.set("apikey", config.apikey)
        .set("clientkey", config.clientkey);
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });

  describe("オブジェクト登録", function(){
    describe("save", function(){
      context("クラス定義が存在すれば、登録に成功し", function(){
        var Food = null;
        var food = null;
        before(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange", type: "fruit", status: "success"});
        });
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
        var NonExist = null;
        var food = null;
        before(function(){
          NonExist = ncmb.DataStore("nonexist");
          food = new NonExist({name: "orange", type: "fruit", status: "failure"});
        });
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
    describe("作成処理を", function(){
      describe("2 つの Object (1 frame 内に収まる) を処理", function(){
        context("成功した場合に", function(){
          var Food = null;
          var foods = [];
          before(function(){
            Food = ncmb.DataStore("food");
            foods.push(new Food({key: "value1"}));
            foods.push(new Food({key: "value2"}));
          });

          it("callbackで取得できる", function(done){
            Food.batch(foods, function(err, list){
              if(err) {
                done(err);
              } else {
                expect(list[0].objectId).to.be.eql("food_id1");
                expect(list[1].objectId).to.be.eql("food_id2");
                done();
              }
            });
          });

          it("promise取得できる", function(done){
            Food.batch(foods)
                .then(function(list){
                  expect(list[0].objectId).to.be.eql("food_id1");
                  expect(list[1].objectId).to.be.eql("food_id2");
                  done();
                })
                .catch(function(err){
                  done(err);
                });
          });
        });

        context("失敗した場合に", function(){
          var Food = null;
          before(function(){
            Food = ncmb.DataStore("food");
          })
          it("saveAll (callback取得できる)", function(done){
            Food.batch([], function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("saveAll (promise取得できる)", function(done){
            Food.batch([])
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

      context("60 の Object (1 frame に収まらない) を処理", function(){
        context("成功した場合に", function(){
          var Food = null;
          before(function(){
            Food = ncmb.DataStore("megafood");
          });
          it("callback で取得できる", function(done){
            var foods = [];
            for(var i = 0; i < 60; i++) {
              foods.push(new Food({key: "value" + i}));
            }
            Food.batch(foods, function(err, list){
              if(err) {
                done(err);
              } else {
                expect(list[0].objectId).to.be.eql("nsgVyp0UyXQYTjbU");
                done();
              }
            });
          });
        });
      });
    });

    describe("更新処理", function(){
    });

    describe("削除処理", function(){
    });
  });

  describe("オブジェクト検索", function(){
    describe("fetchAll", function(){
      context("クラス定義が存在しなければ、取得に失敗しエラーが返り", function(){
        var Food = null;
        before(function(){
          Food = ncmb.DataStore("bizarrefruit");
        });
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
        it("callback で取得できる");
        it("promise で取得できる");
      });
      context("クラス定義が存在し、データがあれば、リストが返り", function(){
        it("callback で取得できる");
        it("promise で取得できる");
      });
    });
  });
});
