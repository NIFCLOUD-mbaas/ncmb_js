"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Query", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });

  describe("オブジェクト検索", function(){
    var QueryTest = null;
    describe("fetchAll", function(){
      context("データがあれば、リストが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].objectId).to.be.equal("fetchAll_object_1");
              expect(objs[1].objectId).to.be.equal("fetchAll_object_2");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(2);
                    expect(objs[0].objectId).to.be.equal("fetchAll_object_1");
                    expect(objs[1].objectId).to.be.equal("fetchAll_object_2");
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("データがなければ、空のリストが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(0);
              expect(objs).to.be.eql([]);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(0);
                    expect(objs).to.be.eql([]);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
    });
    describe("fetch", function(){
      context("データがあれば、オブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTestFetch");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.equal("fetch_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetch()
                  .then(function(obj){
                    expect(obj.objectId).to.be.equal("fetch_object_1");;
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("データがなければ、空のオブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.be.eql({});
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetch()
                  .then(function(obj){
                    expect(obj).to.be.eql({});
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
    });
    describe("fetchById", function(){
      context("データがあれば、オブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchById("fetchById_object_1", function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.equal("fetchById_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchById("fetchById_object_1")
                  .then(function(obj){
                    expect(obj.objectId).to.be.equal("fetchById_object_1");
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("データがなければ、404エラーが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchById("empty_id",function(err, obj){
            if(err){
              expect(err.text).to.be.equal('{"code":"E404001","error":"No data available."}');
              done();
            }else{
              done(new Error("失敗すべき"));
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchById("empty_id")
                  .then(function(obj){
                    done(new Error("失敗すべき"));
                  })
                  .catch(function(err){
                    expect(err.text).to.be.equal('{"code":"E404001","error":"No data available."}');
                    done();
                  });
        });
      });
    });
  });
  describe("検索条件追加", function(){
    var QueryTest = null;
    describe("where", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .where({number: 1})
          .fetchAll(function(err, objs){
            console.log("err:",err);
            console.log("objs:",objs);
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].objectId).to.be.equal("where_object_1");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .where({number: 1})
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].objectId).to.be.equal("where_object_1");
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
