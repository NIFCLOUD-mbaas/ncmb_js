"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB DataStore", function(){
  var ncmb = null;
  var userName = "Yamada Tarou"
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

  describe("インスタンス生成", function(){
    var Food = null;
    var food = null;
    it("プロパティをconstructorで指定し、取得できる", function(done){
      Food = ncmb.DataStore("food");
      food = new ncmb.User({name: "orange"});
      expect(food.name).to.be.equal("orange");
      done();
    })
    it("変更許可のないキーを指定した場合、値を変更できない", function(done){
      Food = ncmb.DataStore("food");
      food = new ncmb.User({className: "drink"});
      try{
        expect(food.className).to.be.equal("drink");
        done(new Error("失敗すべき"));
      }catch(err){
        done();
      }
    });
  });
  var data_callback_id = null;
  var data_promise_id  = null;
  describe("オブジェクト登録", function(){
    describe("save", function(){
      context("クラス定義が存在すれば、登録に成功し", function(){
        var Food = null;
        var food = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange", type: "fruit", status: "success"});
        });
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.exist;
              data_callback_id = obj.objectId;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          food.save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                data_promise_id = obj.objectId;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      
      it("クラス名がなければ、クラス生成に失敗する", function(done){
        expect(function(){
          ncmb.DataStore();
        }).to.throw(Error);
        expect(function(){
          ncmb.DataStore(null);
        }).to.throw(Error);
        expect(function(){
          ncmb.DataStore(undefined);
        }).to.throw(Error);
        done();
      });
      
      context("Dateタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var aSimpleDate = null;
        var food = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          aSimpleDate = new Date(1999, 11, 31, 23, 59, 59, 999);
          food = new Food({harvestDate: aSimpleDate});
        })
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            if(err) {
              done(err);
            } else {
              expect(obj.harvestDate).to.exist;
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
                expect(obj.harvestDate).to.exist;
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

      context("未保存のncmb.Dataタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var Component = null;
        var food = null;
        var component = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange"});
          Component = ncmb.DataStore("Component");
          component = new Component({calorie: "50"});
          food.component = component;
        })
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.exist;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          food.save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("保存済みのncmb.Dataタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var Component = null;
        var food = null;
        var component = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange"});
          Component = ncmb.DataStore("Component");
          component = new Component({calorie: "50"});
        })
        it("callback で取得できる", function(done){
          component.save()
                   .then(function(obj){
                      food.component = obj;
                      food.save(function(err, data){
                        if(err){
                          done(err);
                        }else{
                          expect(obj.objectId).to.exist;
                          done();
                        }
                      });
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
        it("promise で取得できる", function(done){
          component.save()
                   .then(function(obj){
                      food.component = obj;
                      return food.save();
                   })
                   .then(function(obj){
                    expect(obj.objectId).to.exist;
                    done();
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
      });
      context("未保存のncmb.Userタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var food = null;
        var user = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange"});
          user = new ncmb.User({password:"password"});
          food.member = user;
        })
        it("callback で取得できる", function(done){
          if(!ncmb.stub) userName = "pointer_callback";
          user.set("userName", userName);

          food.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.exist;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          if(!ncmb.stub) userName = "pointer_promise";
          user.set("userName", userName);

          food.save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("保存済みのncmb.Userタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var food = null;
        var user = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange"});
          user = new ncmb.User({password:"password"});
        })
        it("callback で取得できる", function(done){
          if(!ncmb.stub) userName = "pointer_preset_callback";
          user.set("userName", userName);

          user.signUpByAccount()
                   .then(function(obj){
                      food.member = obj;
                      food.save(function(err, data){
                        if(err){
                          done(err);
                        }else{
                          expect(obj.objectId).to.exist;
                          done();
                        }
                      });
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
        it("promise で取得できる", function(done){
          if(!ncmb.stub) userName = "pointer_preset_promise";
          user.set("userName", userName);

          user.signUpByAccount()
                   .then(function(obj){
                      food.member = obj;
                      return food.save();
                   })
                   .then(function(obj){
                    expect(obj.objectId).to.exist;
                    done();
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
      });
      context("未保存のncmb.Userタイプをプロパティに設定したとき、登録に必要なプロパティが足りなければオブジェクト保存に失敗し", function(){
        var Food = null;
        var food = null;
        var user = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange"});
          user = new ncmb.User({userName:"Yamada Tarou"});
          food.member = user;
        })
        it("callback でエラーを取得できる", function(done){
          food.save(function(err, obj){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
        it("promise でエラーを取得できる", function(done){
          food.save()
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                done();
              });
        });
      });
      context("nullが含まれるデータを保存する際、登録に成功し", function(){
        var Food = null;
        var food = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange", type: "fruit", test: null});
        });
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.exist;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          food.save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
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
        var Food = null;
        before(function(){
          Food = ncmb.DataStore("food");
        });

        it("callback で取得できる", function(done){
          Food.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.exist;
              done();
            }
          });
        });

        it("promise で取得できる", function(done){
          Food.fetch()
              .then(function(obj){
                expect(obj.objectId).to.exist;
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
        var Food = null;
        before(function(){
          Food = ncmb.DataStore("food");
        });

        it("callback で取得できる", function(done){
          Food.fetchById(data_callback_id, function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.exist;
              done();
            }
          });
        });

        it("promise で取得できる", function(done){
          Food.fetchById(data_promise_id)
              .then(function(obj){
                expect(obj.objectId).to.exist;
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
      var Food = null;
      var food = null;
      beforeEach(function(){
        Food = ncmb.DataStore("food");
        food = new Food({key: "value_new"});
      });

      it("callback で取得できる", function(done){
        food.objectId = data_callback_id;
        food.update(function(err, obj){
          if(err){
            done(err);
          }else{
            expect(obj.updateDate).to.exist;
            done();
          }
        });
      });

      it("promise で取得できる", function(done){
        food.objectId = data_promise_id;
        food.update()
            .then(function(obj){
              expect(obj.updateDate).to.exist;
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });

    context("リレーションを含むレコードの場合update成功", function(){
      var Food = null;
      var food = null;
      beforeEach(function(){
        Food = ncmb.DataStore("food");
        food = new Food({key: "value_new",relation:{__type: 'Relation',className : 'TestJS'}});
      });

      it("callback で取得できる", function(done){
        food.objectId = data_callback_id;
        food.update(function(err, obj){
          if(err){
            done(err);
          }else{
            expect(obj.updateDate).to.exist;
            done();
          }
        });
      });

      it("promise で取得できる", function(done){
        food.objectId = data_promise_id;
        food.update()
            .then(function(obj){
              expect(obj.updateDate).to.exist;
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });

    context("update失敗", function(){
      context("objectIdがない理由で", function(){
        var Food = null;
        var food = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({key: "value_new"});
        });

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
      var Food = null;
      var food = null;
      beforeEach(function(){
        Food = ncmb.DataStore("food");
        food = new Food();
      });

      it("callback で削除結果を取得できる", function(done){
        food.objectId = data_callback_id;
        food.delete(function(err){
          if(err){
            done(err);
          }else{
            done();
          }
        });
      });

      it("promise で削除結果を取得できる", function(done){
        food.objectId = data_promise_id;
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
        var Food = null;
        var food = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({});
        });

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
      context("データがなければ、空のリストが返り", function(){
        var NonExist = null;
        before(function(){
          NonExist = ncmb.DataStore("nonexist");
        });
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

      context("データがあれば、リストが返り", function(){
        var FetchList = null;
        before(function(done){
          FetchList = ncmb.DataStore("fetchlist");
          if(!ncmb.stub){
            fetchdata = new FetchList();
            fetchdata2 = new FetchList();
            fetchdata.save()
                     .then(function(){
                       return fetchdata2.save();
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
        it("callback で取得できる", function(done){
          FetchList.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].objectId).to.exist;
              expect(objs[1].objectId).to.exist;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          FetchList.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(2);
                    expect(objs[0].objectId).to.exist;
                    expect(objs[1].objectId).to.exist;
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
