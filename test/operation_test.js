"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Operation", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol )
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });
  describe("プロパティ設定", function(){
    var user = null;
    context("set", function(){
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("指定したkeyのプロパティにvalueを設定できる", function(done){
        user.set("key", "value");
        expect(user.key).to.be.eql("value");
        done();
      });
      it("指定したkeyが文字列でないとき、エラーが返る", function(done){
        try{
          user.set(["key"], "value");
          done("失敗すべき");
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
      it("指定したkeyが設定不可だったとき、エラーが返る", function(done){
        try{
          user.set("className", "value");
          done("失敗すべき");
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
    });
  });

  describe("プロパティ取得", function(){
    var user = null;
    context("get", function(){
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("指定したkeyのプロパティの値を取得できる", function(done){
        user.key = "value";
        expect(user.get("key")).to.be.eql("value");
        done();
      });
      it("undefinedとnullを判別して取得できる", function(done){
        user.isNull = null;
        expect(user.get("isNull")).to.be.eql(null);
        expect(user.get("isUnset")).to.be.eql(undefined);
        done();
      });
      it("指定したkeyが文字列でないとき、エラーが返る", function(done){
        try{
          var value = user.get(["key"]);
          done("失敗すべき");
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
    });
  });

  describe("更新オペレーション設定", function(){
    var classForIncrementTest = null;
    var objForIncrementTest = null;
    var user = null;
    var validObjIdThatIsSetIncrementWithAmount =  null;
    var validObjIdThatIsSetIncrementWithoutAmount =  null;
    var validObjIdThatIsSetIncrementMultiple =  null;
    var validObjIdThatIsSetIncrementWithMethodChain =  null;
    var validObjIdThatIsOverrideOperation =  null;
    context("setIncrement", function(){
      beforeEach(function(){
        classForIncrementTest = ncmb.DataStore("increment");
        objForIncrementTest = new classForIncrementTest;
      });
      it("keyとamountを指定してsetIncrementを利用し、オブジェクトを新規保存すると、keyのプロパティにIncrementした結果の数が設定される", function(done){
        objForIncrementTest.setIncrement("increment", 2);
        objForIncrementTest.save(function(err, obj){
          if(err){
            done(err);
          }else{
            validObjIdThatIsSetIncrementWithAmount = obj.objectId;
            classForIncrementTest.fetchById(validObjIdThatIsSetIncrementWithAmount, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.increment).to.be.eql(2);
                done();
              }
            });
          }
        });
      });
      it("keyのみを指定した場合、amountが1になる", function(done){
        objForIncrementTest.setIncrement("increment");
        objForIncrementTest.save(function(err, obj){
          if(err){
            done(err);
          }else{
            validObjIdThatIsSetIncrementWithoutAmount = obj.objectId;
            classForIncrementTest.fetchById(validObjIdThatIsSetIncrementWithoutAmount, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.increment).to.be.eql(1);
                done();
              }
            });
          }
        });
      });
      it("複数回setIncrementを実行した場合、amountの合計値が保存される", function(done){
        objForIncrementTest.setIncrement("increment", 3);
        objForIncrementTest.setIncrement("increment", 2);
        objForIncrementTest.save(function(err, obj){
          if(err){
            done(err);
          }else{
            validObjIdThatIsSetIncrementMultiple = obj.objectId;
            classForIncrementTest.fetchById(validObjIdThatIsSetIncrementMultiple, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.increment).to.be.eql(5);
                done();
              }
            });
          }
        });
      });
      it("メソッドチェインで連続実行できる", function(done){
        objForIncrementTest.setIncrement("increment", 3).setIncrement("increment");
        objForIncrementTest.save(function(err, obj){
          if(err){
            done(err);
          }else{
            validObjIdThatIsSetIncrementWithMethodChain = obj.objectId;
            classForIncrementTest.fetchById(validObjIdThatIsSetIncrementWithMethodChain, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.increment).to.be.eql(4);
                done();
              }
            });
          }
        });
      });
      it("同じキーに複数のオペレーションが設定された場合は上書きする", function(done){
        objForIncrementTest.add("increment", ["apple"]).setIncrement("increment",6);
        objForIncrementTest.save(function(err, obj){
          if(err){
            done(err);
          }else{
            validObjIdThatIsOverrideOperation = obj.objectId;
            classForIncrementTest.fetchById(validObjIdThatIsOverrideOperation, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.increment).to.be.eql(6);
                done();
              }
            });
          }
        });
      });

      it("keyとamountを指定してsetIncrementを利用し、オブジェクトを更新すると、setIncrementした結果がデータストア上で設定される", function(done){
        validObjIdThatIsSetIncrementWithAmount = "validObjIdThatIsSetIncrementWithAmount";
        objForIncrementTest.objectId = validObjIdThatIsSetIncrementWithAmount;
        objForIncrementTest.setIncrement("increment", 1);
        objForIncrementTest.update()
            .then(function(obj){
              classForIncrementTest.fetchById(validObjIdThatIsSetIncrementWithAmount, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.increment).to.be.eql(3);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });
      it("keyのみを指定した場合、amountが1に設定されてオブジェクト更新がされる", function(done){
        validObjIdThatIsSetIncrementWithoutAmount = "validObjIdThatIsSetIncrementWithoutAmount";
        objForIncrementTest.objectId = validObjIdThatIsSetIncrementWithoutAmount;
        objForIncrementTest.setIncrement("increment");
        objForIncrementTest.update()
            .then(function(obj){
              classForIncrementTest.fetchById(validObjIdThatIsSetIncrementWithoutAmount, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.increment).to.be.eql(2);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });

      it("複数回実行した場合、amountの合計値でオブジェクトが更新される", function(done){
        validObjIdThatIsSetIncrementMultiple = "validObjIdThatIsSetIncrementMultiple";
        objForIncrementTest.objectId = validObjIdThatIsSetIncrementMultiple;
        objForIncrementTest.setIncrement("increment",3);
        objForIncrementTest.setIncrement("increment",2);
        objForIncrementTest.update()
            .then(function(obj){
              classForIncrementTest.fetchById(validObjIdThatIsSetIncrementMultiple, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.increment).to.be.eql(10);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });
      it("メソッドチェインで指定したsetIncrementでオブジェクトが更新される", function(done){
        validObjIdThatIsSetIncrementWithMethodChain = "validObjIdThatIsSetIncrementWithMethodChain";
        objForIncrementTest.objectId = validObjIdThatIsSetIncrementWithMethodChain;
        objForIncrementTest.setIncrement("increment", 3).setIncrement("increment");
        objForIncrementTest.update()
            .then(function(obj){
              classForIncrementTest.fetchById(validObjIdThatIsSetIncrementWithMethodChain, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.increment).to.be.eql(8);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });

      it("同じキーに複数のオペレーションが設定された場合、上書きされてオブジェクトが更新される", function(done){
        validObjIdThatIsOverrideOperation = "validObjIdThatIsOverrideOperation";
        objForIncrementTest.objectId = validObjIdThatIsOverrideOperation;
        objForIncrementTest.add("increment", ["apple"]).setIncrement("increment",6);
        objForIncrementTest.update()
            .then(function(obj){
              classForIncrementTest.fetchById(validObjIdThatIsOverrideOperation, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.increment).to.be.eql(12);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });

      it("amountがnumber以外のとき、エラーが返る", function(done){
        expect(function(){
          objForIncrementTest.setIncrement("increment","1");
        }).to.throw(Error);
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          objForIncrementTest.setIncrement("save",1);
        }).to.throw(Error);
        done();
      });
    });
    context("add", function(){
      var arr =  null;
      var Adds = null;
      var adds = null;
      var add_id = null;
      var add_id2 = null;
      var add_id3 = null;
      var add_id4 = null;
      var add_id5 = null;
      beforeEach(function(){
        Adds = ncmb.DataStore("adds");
        adds = new Adds;
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる(In case save)", function(done){
        adds.add("key", [1,2,3,4]);
        adds.save(function(err, obj){
          if(err){
            done(err);
          }else{
            add_id = obj.objectId;
            Adds.fetchById(add_id, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.key).to.be.eql([1,2,3,4]);
                done();
              }
            });
          }
        });
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる(In case save)", function(done){
        adds.add("key", 1);
        adds.save(function(err, obj){
          if(err){
            done(err);
          }else{
            add_id2 = obj.objectId;
            Adds.fetchById(add_id2, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.key).to.be.eql([1]);
                done();
              }
            });
          }
        });
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる(In case save)", function(done){
        adds.add("key", [1,2,3]);
        adds.add("key", [4,5,6]);
        adds.save(function(err, obj){
          if(err){
            done(err);
          }else{
            add_id3 = obj.objectId;
            Adds.fetchById(add_id3, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.key).to.be.eql([1,2,3,4,5,6]);
                done();
              }
            });
          }
        });
      });
      it("メソッドチェインで連続実行できる(In case save)", function(done){
        adds.add("key", [1,2,3]).add("key", [4,5]);
        adds.save(function(err, obj){
          if(err){
            done(err);
          }else{
            add_id4 = obj.objectId;
            Adds.fetchById(add_id4, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.key).to.be.eql([1,2,3,4,5]);
                done();
              }
            });
          }
        });
      });
      it("他のオペレーションメソッドを上書きできる(In case save)", function(done){
        adds.remove("key", ["apple"]).add("key", [1,2,3]);
        adds.save(function(err, obj){
          if(err){
            done(err);
          }else{
            add_id5 = obj.objectId;
            Adds.fetchById(add_id5, function(err, obj){
              if(err){
                done(err);
              }else{
                expect(obj.key).to.be.eql([1,2,3]);
                done();
              }
            });
          }
        });
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる (In Case update() )", function(done){
        add_id = "add_id"
        adds.objectId = add_id;
        adds.add("key", [1,2,3,4]);
        adds.update()
            .then(function(obj){
              Adds.fetchById(add_id, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.key).to.be.eql([1,2,3,4,1,2,3,4]);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });

      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる(In case update() )", function(done){
        add_id2 = "add_id2"
        adds.objectId = add_id2;
        adds.add("key", 1);
        adds.update()
            .then(function(obj){
              Adds.fetchById(add_id2, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.key).to.be.eql([1,1]);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる(In case update())", function(done){
        add_id3 = "add_id3"
        adds.objectId = add_id3;
        adds.add("key", [1,2,3]);
        adds.add("key", [4,5,6]);
        adds.update()
            .then(function(obj){
              Adds.fetchById(add_id3, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.key).to.be.eql([1,2,3,4,5,6,1,2,3,4,5,6]);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });
      it("メソッドチェインで連続実行できる(In case update())", function(done){
        add_id4 = "add_id4"
        adds.objectId = add_id4;
        adds.add("key", [4,2,3]).add("key", [4,5,6]);
        adds.update()
            .then(function(obj){
              Adds.fetchById(add_id4, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.key).to.be.eql([1,2,3,4,5,4,2,3,4,5,6]);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });
      it("他のオペレーションメソッドを上書きできる(In case update())", function(done){
        add_id5 = "add_id5"
        adds.objectId = add_id5;
        adds.remove("key", ["apple"]).add("key", [1,2,4]);
        adds.update()
            .then(function(obj){
              Adds.fetchById(add_id5, function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.key).to.be.eql([1,2,3,1,2,4]);
                  done();
                }
              });
            })
            .catch(function(err){
              done(err);
            });
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.add("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.add("key");
        }).to.throw(Error);
        done();
      });
    });
    context("addUnique", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.addUnique("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.addUnique("key", 1);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.addUnique("key", [1,2,3]);
        user.addUnique("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.addUnique("key", [1,2,3]).addUnique("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.remove("key", ["apple"]).addUnique("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("key");
        }).to.throw(Error);
        done();
      });
      it("重複する値が入力されたとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("key",[1,2,3])
              .addUnique("key",1);
        }).to.throw(Error);
        done();
      });
    });
    context("remove", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.remove("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.remove("key", 1);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.remove("key", [1,2,3]);
        user.remove("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.remove("key", [1,2,3]).remove("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.add("key", ["apple"]).remove("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.remove("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.remove("key");
        }).to.throw(Error);
        done();
      });
    });
  });
});
