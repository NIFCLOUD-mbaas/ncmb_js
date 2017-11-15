"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Query", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol)
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "")
          .set("stub", config.apiserver.stub);
    }
  });

  describe("オブジェクト検索", function(){
    var QueryTest = null;
    describe("fetchAll", function(){
      var queryTest1   = null;
      var queryTest2  = null;
      var fetchAllId1 = "fetchAll_object_1";
      var fetchAllId2 = "fetchAll_object_2";
      before(function(done){
        QueryTest  = ncmb.DataStore("QueryTestFetchAll");
        if(!ncmb.stub){
          queryTest1 = new QueryTest();
          queryTest2 = new QueryTest();
          queryTest1.save()
                    .then(function(obj){
                      fetchAllId1 = obj.objectId;
                      return queryTest2.save();
                    })
                    .then(function(obj){
                      fetchAllId2 = obj.objectId;
                      done();
                    })
                    .catch(function(err){
                      done(new Error("前処理に失敗しました。"));
                    });
        }else{
          done();
        }
      });
      context("検索条件に合致するデータがあれば、リストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].objectId).to.be.equal(fetchAllId1);
              expect(objs[1].objectId).to.be.equal(fetchAllId2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(2);
                    expect(objs[0].objectId).to.be.equal(fetchAllId1);
                    expect(objs[1].objectId).to.be.equal(fetchAllId2);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("検索条件に合致するデータがなければ、空の配列が返り", function(){
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
      var queryTest  = null;
      var fetchId = "fetch_object_1";
      before(function(done){
        QueryTest  = ncmb.DataStore("QueryTestFetch");
        if(!ncmb.stub){
          queryTest = new QueryTest();
          queryTest.save()
                   .then(function(obj){
                     fetchId = obj.objectId;
                     done();
                   })
                   .catch(function(err){
                     done(new Error("前処理に失敗しました。"));
                   });
        }else{
          done();
        }
      });
      context("検索条件に合致するデータがあれば、その中の一つがオブジェクトが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.equal(fetchId);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetch()
                  .then(function(obj){
                    expect(obj.objectId).to.be.equal(fetchId);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("検索条件に合致するデータがなければ、空のオブジェクトが返り", function(){
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
      var queryTest  = null;
      var fetchId = "fetchById_object_1";
      before(function(done){
        QueryTest  = ncmb.DataStore("QueryTestFetchById");
        if(!ncmb.stub){
          queryTest = new QueryTest();
          queryTest.save()
                   .then(function(obj){
                     fetchId = obj.objectId;
                     done();
                   })
                   .catch(function(err){
                     done(new Error("前処理に失敗しました。"));
                   });
        }else{
          done();
        }
      });
      context("指定したobjectIdのデータがあれば、オブジェクトが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest.fetchById(fetchId, function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.equal(fetchId);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchById(fetchId)
                  .then(function(obj){
                    expect(obj.objectId).to.be.equal(fetchId);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("指定したobjectIdのデータがなければ、404エラーが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchById("empty_id",function(err, obj){
            if(err){
              expect(err).to.be.an.instanceof(Error);
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
                    expect(err).to.be.an.instanceof(Error);
                    done();
                  });
        });
      });
    });
  });
  describe("検索条件追加", function(){
    var QueryTest = null;
    before(function(done){
      if(!ncmb.stub){
        QueryTest = ncmb.DataStore("QueryTest");
        var queryTest1 = new QueryTest();
        var queryTest2 = new QueryTest();
        var geopoint1  = new ncmb.GeoPoint(5,5);
        var geopoint2  = new ncmb.GeoPoint(70,100);
        queryTest1.set("number", 1)
                  .set("name", "exist")
                  .set("regex", "forregex")
                  .set("array", [1,2,3])
                  .set("location", geopoint1)
                  .set("city", "Tokyo")
                  .set("status", "pointed")
                  .save()
                  .then(function(obj){
                    return queryTest2.set("number", 2)
                                     .set("regex", "Regexback")
                                     .set("array", [2,3,4])
                                     .set("location", geopoint2)
                                     .set("city", "Sapporo")
                                     .set("pointer", obj)
                                     .save();
                  })
                  .then(function(){
                    done();
                  })
                  .catch(function(){
                    done(new Error("前処理に失敗しました。"));
                  });
      }else{
        done();
      }
    });
    describe("where", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .where({number: 1})
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
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
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がオブジェクト以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.where("{number: 1}");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("equalTo", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestEqualTo");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値がvalueと等しいデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .equalTo("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .equalTo("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索キーが文字列で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.equalTo(["number"], 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("notEqualTo", function(){
      context("keyの値がvalueと等しくないデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          if(ncmb.stub){
            QueryTest = ncmb.DataStore("QueryTestNotEqualTo");
          }else{
            QueryTest = ncmb.DataStore("QueryTest");
          }
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notEqualTo("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notEqualTo("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("lessThan", function(){
      context("keyの値がvalueより小さいデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          if(ncmb.stub){
            QueryTest = ncmb.DataStore("QueryTestLessThan");
          }else{
            QueryTest = ncmb.DataStore("QueryTest");
          }
        });
        it("callback で取得できる", function(done){
          QueryTest
          .lessThan("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .lessThan("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("lessThanOrEqualTo", function(){
      context("keyの値がvalue以下のデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          if(ncmb.stub){
            QueryTest = ncmb.DataStore("QueryTestLessThanOrEqualTo");
          }else{
            QueryTest = ncmb.DataStore("QueryTest");
          }
        });
        it("callback で取得できる", function(done){
          QueryTest
          .lessThanOrEqualTo("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .lessThanOrEqualTo("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("greaterThan", function(){
      context("keyの値がvalueより大きいデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          if(ncmb.stub){
            QueryTest = ncmb.DataStore("QueryTestGreaterThan");
          }else{
            QueryTest = ncmb.DataStore("QueryTest");
          }
        });
        it("callback で取得できる", function(done){
          QueryTest
          .greaterThan("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .greaterThan("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("greaterThanOrEqualTo", function(){
      context("keyの値がvalue以上のデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          if(ncmb.stub){
            QueryTest = ncmb.DataStore("QueryTestGreaterThanOrEqualTo");
          }else{
            QueryTest = ncmb.DataStore("QueryTest");
          }
        });
        it("callback で取得できる", function(done){
          QueryTest
          .greaterThanOrEqualTo("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .greaterThanOrEqualTo("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("in", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestIn");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値がvalue配列のいずれかと等しいデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .in("number", [1,3,4])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .in("number", [1,3,4])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が配列以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.in("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("notIn", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestNotIn");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値がvalue配列のいずれとも等しくないデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .notIn("number", [2,3,4])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notIn("number", [2,3,4])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が配列以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.notIn("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("exists", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestExists");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("valueがtrueのとき、keyに値が存在するデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .exists("name", true)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("name", true)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("valueがfalseのとき、keyに値が存在しないデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .exists("name", false)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("name", false)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("valueがundefinedのとき、keyに値が存在するデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
              .exists("name")
              .fetchAll(function(err, objs){
                if(err){
                  done(err);
                }else{
                  expect(objs.length).to.be.equal(1);
                  expect(objs[0].number).to.be.equal(1);
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          QueryTest
              .exists("name")
              .fetchAll()
              .then(function(objs){
                expect(objs.length).to.be.equal(1);
                expect(objs[0].number).to.be.equal(1);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      it("検索条件が真偽値以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.exists("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("regularExpressionTo", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestRegularExpressionTo");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値がvalueの正規表現を含むデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("regex", "regex")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("regex", "regex")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("前方一致を指定し、データを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("regex", "^for")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("regex", "^for")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("後方一致を指定し、データを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("regex", "back$")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("regex", "back$")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が文字列以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.regularExpressionTo("regex", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("inArray", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestInArray");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値がvalue配列のいずれかを含む配列のデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .inArray("array", [1,5,6])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].array[0]).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inArray("array", [1,5,6])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].array[0]).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定でき、条件に合うデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .inArray("array", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].array[0]).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inArray("array", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
              expect(objs[0].array[0]).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("notInArray", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestNotInArray");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値がvalue配列のいずれも含まない配列のデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .notInArray("array", [4,5,6])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].array[0]).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notInArray("array", [4,5,6])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].array[0]).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定でき、条件に合うデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .notInArray("array", 4)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].array[0]).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notInArray("array", 4)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].array[0]).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("allInArray", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestAllInArray");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値がvalue配列のすべてを含む配列のデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .allInArray("array", [1,2,3])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].array[0]).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .allInArray("array", [1,2,3])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].array[0]).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定でき、条件に合致するデータを検索した結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .allInArray("array", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].array[0]).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .allInArray("array", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].array[0]).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("near", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestNear");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値が位置情報のデータがあれば、valueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .near("location", geoPoint)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .near("location", geoPoint)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.near("location", [0, 0]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinKilometers", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestWithinKm");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値が位置情報のデータがあれば、指定したKmの範囲内でvalueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinKilometers("location", geoPoint, 1000)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinKilometers("location", geoPoint, 1000)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.withinKilometers("location", [0, 0], 1000);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinMiles", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestWithinMile");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値が位置情報のデータがあれば、指定したマイルの範囲内でvalueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinMiles("location", geoPoint, 1000)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinMiles("location", geoPoint, 1000)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.withinMiles("location", [0, 0], 1000);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinRadians", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestWithinRad");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値が位置情報のデータがあれば、指定したラジアンの範囲内でvalueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinRadians("location", geoPoint, 0.5)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinRadians("location", geoPoint, 0.5)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.withinRadians("location", [0, 0], 0.5);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinSquare", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestWithinSquare");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値が指定した矩形内の位置情報のデータを検索した結果のリストが返り", function(){
        var swPoint = null;
        var nePoint = null;
        beforeEach(function(){
          swPoint = new ncmb.GeoPoint(0,0);
          nePoint = new ncmb.GeoPoint(80, 80);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinSquare("location", swPoint, nePoint)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinSquare("location", swPoint, nePoint)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.withinSquare("location", [0, 0], [100, 100]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });

    describe("or", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestOr");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("複数の検索条件を配列で指定し、いずれかに合致するデータの検索結果が返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2),
               QueryTest.lessThan("number",2)])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2),
               QueryTest.lessThan("number",2)])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回条件を指定したとき、すべての条件に合致する検索結果が返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or([QueryTest.lessThan("number",2)])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or([QueryTest.lessThan("number",2)])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("単一条件を配列に入れずに直接追加することができ、条件に合う検索結果が返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or(QueryTest.lessThan("number",2))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or(QueryTest.lessThan("number",2))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.or({number:1});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("select", function(){
      var SubQuery = null;
      before(function(done){
        if(!ncmb.stub){
          SubQuery = ncmb.DataStore("SubQuery");
          var subquery = new SubQuery();
          subquery.set("population", 10000001)
                  .set("cityName", "Tokyo")
                  .save()
                  .then(function(){
                    done();
                  })
                  .catch(function(){
                    done(new Error("前処理に失敗しました。"));
                  });
        }else{
          done();
        }
      });
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestSelect");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
        }
      });
      context("keyの値が、サブクエリの検索結果がsubkeyに持つ値のいずれかと一致するオブジェクトを検索した結果が返り", function(){
        beforeEach(function(){
          SubQuery = ncmb.DataStore("SubQuery");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .select("city", "cityName", SubQuery.greaterThan("population",10000000))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].city).to.be.equal("Tokyo");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .select("city", "cityName", SubQuery.greaterThan("population",10000000))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].city).to.be.equal("Tokyo");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.select("city", "cityName", {population:10000000});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        SubQuery = ncmb.DataStore("SubQuery");
        try{
          QueryTest.select(["city"], "cityName", SubQuery.greaterThan("population",10000000));
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("subkeyが文字列以外で指定されたとき、エラーが返る", function(done){
        SubQuery = ncmb.DataStore("SubQuery");
        try{
          QueryTest.select("city", ["cityName"], SubQuery.greaterThan("population",10000000));
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("Userクラスの検索条件を指定できる", function(done){
        try{
          QueryTest.select("Mayer", "name", ncmb.User.equalTo("post","Mayer"));
          done();
        }catch(err){
          done(err);
        }
      });
      it("Roleクラスの検索条件を指定できる", function(done){
        try{
          QueryTest.select("class", "classname", ncmb.Role.equalTo("course","upper"));
          done();
        }catch(err){
          done(err);
        }
      });
    });
    describe("select limit skip", function(){
      var QueryTest = null;
      var SubQuery = null;
      
      before(function(){
             QueryTest = ncmb.DataStore("QueryTestSelectLimitSkip");
             SubQuery = ncmb.DataStore("SubQuery");
      });
      context("keyの値が、サブクエリの検索結果がsubkeyに持つ値のいずれかと一致するオブジェクトを検索した結果が返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .select("city", "cityName", SubQuery.greaterThan("population",10000000).limit(1).skip(1))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].city).to.be.equal("Tokyo");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .select("city", "cityName", SubQuery.greaterThan("population",10000000).limit(1).skip(1))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].city).to.be.equal("Tokyo");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    
    describe("relatedTo", function(){
      var BaseClass = null;
      var baseObj = null;
      var baseObjId = null;
      before(function(done){
        BaseClass = ncmb.DataStore("BaseClass");
        if(!ncmb.stub){
          baseObj = new BaseClass();
          QueryTest = ncmb.DataStore("QueryTest");
          QueryTest.equalTo("number", 1)
                   .fetch()
                   .then(function(obj){
                     var relation = new ncmb.Relation();
                     relation.add(obj);
                     return baseObj.set("belongs", relation)
                                   .save();
                   })
                   .then(function(obj){
                     baseObjId = obj.objectId;
                     done();
                   })
                   .catch(function(err){
                     done(err);
                   });
        }else{
          QueryTest = ncmb.DataStore("QueryTestRelatedTo");
          baseObjId = "base_id";
          done();
        }
      });
      context("設定したオブジェクトのkeyに関連づけられているオブジェクトを検索した結果が返り", function(){
        before(function(){
          baseObj = new BaseClass();
          baseObj.objectId = baseObjId;
        });
        it("callback で取得できる", function(done){
          QueryTest
          .relatedTo(baseObj, "belongs")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .relatedTo(baseObj, "belongs")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("ncmb.Userの関連オブジェクトを検索できる", function(done){
        var user = new ncmb.User();
        user.objectId = "user_id";
        try{
          QueryTest
          .relatedTo(user, "belongs");
          done();
        }catch(err){
          done(err);
        }
      });
      it("ncmb.Roleの関連オブジェクトを検索できる", function(done){
        var role = new ncmb.Role("related_role");
        role.objectId = "role_id";
        try{
          QueryTest
          .relatedTo(role, "belongs");
          done();
        }catch(err){
          done(err);
        }
      });

      it("objectがobjectIdを持たないときエラーが返る", function(done){
        BaseClass = ncmb.DataStore("BaseClass");
        baseObj = new BaseClass();
        try{
          QueryTest
          .relatedTo(baseObj, "belongs");
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("objectがncmbオブジェクトでないときエラーが返る", function(done){
        try{
          QueryTest
          .relatedTo({name:"name"}, "belongs");
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列でないときエラーが返る", function(done){
        BaseClass = ncmb.DataStore("BaseClass");
        baseObj = new BaseClass();
        baseObj.objectId = "base_id";
        try{
          QueryTest
          .relatedTo(baseObj, ["belongs"]);
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("inQuery", function(){
      var SubQuery = null;
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestInQuery");
          SubQuery = ncmb.DataStore("SubQuery");
        }else{
          QueryTest = ncmb.DataStore("QueryTest");
          SubQuery = ncmb.DataStore("QueryTest");
        }
      });
      context("サブクエリの検索結果のいずれかのポインタをkeyに持つオブジェクトを検索した結果が返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .inQuery("pointer", SubQuery.equalTo("status","pointed"))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inQuery("pointer", SubQuery.equalTo("status","pointed"))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.inQuery("pointer", {status:"pointed"});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.inQuery(["pointer"], SubQuery.equalTo("status","pointed"));
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("Userクラスの検索条件を指定できる", function(done){
        try{
          QueryTest.inQuery("pointer", ncmb.User.equalTo("status","pointed"));
          done();
        }catch(err){
          done(err);
        }
      });
      it("Roleクラスの検索条件を指定できる", function(done){
        try{
          QueryTest.inQuery("pointer", ncmb.Role.equalTo("status","pointed"));
          done();
        }catch(err){
          done(err);
        }
      });
    });
  });

  describe("inQueryのSubQueryにLimit,Skip追加テスト", function(){
      var QueryTest = null;
      var SubQuery = null;
      
      before(function(){
             QueryTest = ncmb.DataStore("QueryTestInQueryLimitSkip");
             SubQuery = ncmb.DataStore("SubQuery");
      });
      
      context("サブクエリの検索結果のいずれかのポインタをkeyに持つオブジェクトをLimit,Skip検索した結果が返り", function(){
          it("callback で取得できる", function(done){
             QueryTest
             .inQuery("pointer", SubQuery.equalTo("status","pointed").limit(1).skip(1))
             .fetchAll(function(err, objs){
                       if(err){
                         done(err);
                       }else{
                         expect(objs.length).to.be.equal(1);
                         expect(objs[0].number).to.be.equal(2);
                         done();
                       }
             });
          });
          it("promise で取得できる", function(done){
             QueryTest
             .inQuery("pointer", SubQuery.equalTo("status","pointed").limit(1).skip(1))
             .fetchAll()
             .then(function(objs){
                   expect(objs.length).to.be.equal(1);
                   expect(objs[0].number).to.be.equal(2);
                   done();
              })
             .catch(function(err){
                    done(err);
              });
          });
      });
  });

  describe("レスポンス加工", function(){
    var QueryTest = null;
    var date = new Date(2015, 6, 29, 23, 59, 59, 999);
    var dateString = '{"__type":"Date","iso":"2015-07-29T14:59:59.999Z"}'
    before(function(done){
      if(!ncmb.stub){
        QueryTest = ncmb.DataStore("OptionalKeyTest");
        var queryTest1 = new QueryTest();
        var queryTest2 = new QueryTest();
        var queryTest3 = new QueryTest();
        queryTest1.set("number", 2)
                  .set("order", 1)
                  .set("status", "pointed")
                  .save()
                  .then(function(obj){
                    return queryTest2.set("number", 1)
                                     .set("order", 2)
                                     .set("pointer", obj)
                                     .save();
                  })
                  .then(function(){
                    return queryTest3.set("number", 2)
                                     .set("order", 2)
                                     .set("date", date)
                                     .save();
                  })
                  .then(function(){
                    done();
                  })
                  .catch(function(){
                    done(new Error("前処理に失敗しました。"));
                  });
      }else{
        done();
      }
    });
    describe("include", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestInclude");
        }else{
          QueryTest = ncmb.DataStore("OptionalKeyTest");
        }
      });
      context("指定したkeyのポインタの中身を含めたオブジェクトが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .exists("pointer", true)
          .include("pointer")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].pointer.status).to.be.equal("pointed");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("pointer", true)
          .include("pointer")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].pointer.status).to.be.equal("pointed");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数のkeyを指定したとき、最後に設定したキーを反映し、", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .exists("pointer", true)
          .include("object")
          .include("pointer")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].pointer.status).to.be.equal("pointed");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("pointer", true)
          .include("object")
          .include("pointer")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].pointer.status).to.be.equal("pointed");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.include(["number"]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("count", function(){
      var res_count = null;
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestCount");
          res_count = 1;
        }else{
          QueryTest = ncmb.DataStore("OptionalKeyTest");
          res_count = 3;
        }
      });
      context("設定するとリスト共に件数が返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .count()
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(res_count);
              expect(objs.count).to.be.equal(res_count);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .count()
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(res_count);
            expect(objs.count).to.be.equal(res_count);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索結果が0件のとき件数が正しく返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .count()
          .equalTo("nullField", "exist")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(0);
              expect(objs.count).to.be.equal(0);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .count()
          .equalTo("nullField", "exist")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(0);
            expect(objs.count).to.be.equal(0);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("order", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestOrder");
        }else{
          QueryTest = ncmb.DataStore("OptionalKeyTest");
        }
      });
      context("指定したkeyの昇順でリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .order("number")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(3);
              expect(objs[0].number).to.be.equal(1);
              expect(objs[1].number).to.be.equal(2);
              expect(objs[2].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(3);
            expect(objs[0].number).to.be.equal(1);
            expect(objs[1].number).to.be.equal(2);
            expect(objs[2].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("descendingフラグをtrueにすると降順でリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .order("number", true)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(3);
              expect(objs[0].number).to.be.equal(2);
              expect(objs[1].number).to.be.equal(2);
              expect(objs[2].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number", true)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(3);
            expect(objs[0].number).to.be.equal(2);
            expect(objs[1].number).to.be.equal(2);
            expect(objs[2].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数の条件を指定して検索するとリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .order("number")
          .order("order")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(3);
              expect(objs[0].number).to.be.equal(1);
              expect(objs[1].number).to.be.equal(2);
              expect(objs[2].number).to.be.equal(2);
              expect(objs[0].order).to.be.equal(2);
              expect(objs[1].order).to.be.equal(1);
              expect(objs[2].order).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number")
          .order("order")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(3);
            expect(objs[0].number).to.be.equal(1);
            expect(objs[1].number).to.be.equal(2);
            expect(objs[2].number).to.be.equal(2);
            expect(objs[0].order).to.be.equal(2);
            expect(objs[1].order).to.be.equal(1);
            expect(objs[2].order).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("descendingフラグが真偽値以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.order("number", "true");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.order(["number"]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("limit", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestLimit");
        }else{
          QueryTest = ncmb.DataStore("OptionalKeyTest");
        }
      });
      context("指定した件数だけリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .limit(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .limit(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回実行すると最後に設定した件数でリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .limit(50)
          .limit(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .limit(50)
          .limit(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("件数が数字以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.limit("1");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("件数が設定可能範囲より大きく指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.limit(1001);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("件数が設定可能範囲より小さく指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.limit(0);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("skip", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestSkip");
        }else{
          QueryTest = ncmb.DataStore("OptionalKeyTest");
        }
      });
      context("指定した件数だけ取得開始位置を後ろにしたリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .skip(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .skip(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回実行すると最後に設定した条件でリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .skip(50)
          .skip(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .skip(50)
          .skip(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("引数が負の値で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.skip(-1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("引数が数値以外で指定されたとき、エラーが返る", function(done){
        try{
          QueryTest.skip("1");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("setOperand", function(){
      beforeEach(function(){
        if(ncmb.stub){
          QueryTest = ncmb.DataStore("QueryTestDate");
        }else{
          QueryTest = ncmb.DataStore("OptionalKeyTest");
        }
      });
      context("オペランドなしの検索条件でvalueにDate型がセットされたとき、検索結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .equalTo("date", date)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(JSON.stringify(objs[0].date)).to.be.equal(dateString);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .equalTo("date", date)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(JSON.stringify(objs[0].date)).to.be.equal(dateString);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("オペランドありの検索条件でvalueにDate型がセットされたとき、検索結果のリストが返り", function(){
        it("callback で取得できる", function(done){
          QueryTest
          .notEqualTo("date", date)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(JSON.stringify(objs[0].date)).to.not.eql(dateString);
              expect(JSON.stringify(objs[1].date)).to.not.eql(dateString);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notEqualTo("date", date)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(JSON.stringify(objs[0].date)).to.not.eql(dateString);
            expect(JSON.stringify(objs[1].date)).to.not.eql(dateString);
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
