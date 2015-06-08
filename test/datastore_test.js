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
      context("Dateタイプを指定し、オブジェクト保存に成功し", function(){
        var Food = ncmb.DataStore("food");
        var aSimpleDate = new Date(1999, 11, 31, 23, 59, 59, 999);
        var food = new Food({harvestDate:  aSimpleDate});
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            if(err) {
              done(err);
            } else {
              expect(obj).to.have.property("harvestDate");
              expect(obj.harvestDate).to.have.property("__type", "Date");
              expect(obj.harvestDate).to.have.property("iso");
              expect(obj.save).to.be.a("function");

              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          food.save()
              .then(function(obj){
                expect(obj).to.have.property("harvestDate");
                expect(obj.harvestDate).to.have.property("__type", "Date");
                expect(obj.harvestDate).to.have.property("iso");
                expect(obj.save).to.be.a("function");

                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });

  describe("オブジェクト取得", function(){
    describe("クラスからオブジェクト１個取得", function(){
      context("fetch", function(){
        var Food = ncmb.DataStore("food");

        it("callback で取得できる", function(done){
          Food.fetch(function(err, obj){
            done(err ? err : null);
          });
        });

        it("promise で取得できる", function(done){
          Food.fetch()
              .then(function(obj){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });

    describe("ObjectIdでオブジェクト取得", function(){
      context("fetchById", function(){
        var Food = ncmb.DataStore("food");

        it("callback で取得できる", function(done){
          Food.fetchById("object_id", function(err, obj){
            done(err ? err : null);
          });
        });

        it("promise で取得できる", function(done){
          Food.fetchById("object_id")
              .then(function(newFood){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });

  describe("オブジェクト更新", function(){
      context("update成功", function(){
        var Food = ncmb.DataStore("food");
        var food = new Food({objectId: "object_id", key: "value_new"});

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

      context("update失敗", function(){
        context("objectIdがない理由で", function(){
          var Food = ncmb.DataStore("food");
          var food = new Food({key: "value_new"});

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
                  done();
                });
          });
        });
      });

  });

  describe("オブジェクト削除", function(){
    context("成功した場合", function(){
      var Food = ncmb.DataStore("food");
      var food = new Food({objectId: "object_id"});

      it("callback で削除結果を取得できる", function(done){
        food.delete(function(err){
          done(err ? err : null);
        });
      });

      it("promise で削除結果を取得できる", function(done){
        food.delete()
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
        var Food = ncmb.DataStore("food");
        var food = new Food({});

        it("callback で削除結果を取得できる", function(done){
          food.delete(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で削除結果を取得できる", function(done){
          food.delete()
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
        it("callback で取得できる", function(done){
          NonExist.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs).to.be.eql([]);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          NonExist.fetchAll()
                  .then(function(objs){
                    expect(objs).to.be.eql([]);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });

      context("クラス定義が存在し、データがあれば、リストが返り", function(){
        var FetchList = ncmb.DataStore("fetchlist");
        it("callback で取得できる", function(done){
          FetchList.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].objectId).to.be.equal("fetch_object_1");
              expect(objs[1].objectId).to.be.equal("fetch_object_2");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          FetchList.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(2);
                    expect(objs[0].objectId).to.be.equal("fetch_object_1");
                    expect(objs[1].objectId).to.be.equal("fetch_object_2");
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
    });
  });
});
