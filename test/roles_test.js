"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Role", function(){
  var ncmb = null;
  var userName1 = "Yamada Tarou";
  var userName2 = "Yamada Hanako";
  var userPassword1 = "password";
  var userPassword2 = "1234";
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey);
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol)
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "")
          .set("stub", config.apiserver.stub);
    }
    if(!ncmb.stub){
      userName1 = "roleUser1";
      userName1 = "roleUser2";
    }
  });
  var add_user_id     = null;
  var add_role_id     = null;
  var belong_user1_id = null;
  var belong_user2_id = null;
  var belong_role1_id = null;
  var belong_role2_id = null;
  var callback_id     = null;
  var promise_id      = null;
  describe("ロール登録", function(){
    describe("save", function(){
      it("ロール名を指定せず、登録に失敗", function(done){
        expect(function(){
          new ncmb.Role();
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role({});
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role(undefined);
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role(null);
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role("");
        }).to.throw(Error);
        done();
      });
      context("存在しないロール名を指定し、登録に成功", function(){
        var newRole = null;
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            newRole = new ncmb.Role("new_role_name");
          }else{
            newRole = new ncmb.Role("new_role_name_callback");
          }
          newRole.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.exist;
              callback_id = obj.objectId;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            newRole = new ncmb.Role("new_role_name");
          }else{
            newRole = new ncmb.Role("new_role_name_promise");
          }
          newRole.save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                promise_id = obj.objectId;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("存在したロール名を指定し、登録に失敗", function(){
        var newRole = null;
        var existRole = null;
        before(function(done){
          newRole   = new ncmb.Role("new_exist_role_name");
          existRole = new ncmb.Role("new_exist_role_name");
          if(!ncmb.stub){
            newRole.save()
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
          existRole.save(function(err, obj){
            if(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            }else{
              done(new Error("失敗すべき"));
            }
          });
        });
        it("promise で取得できる", function(done){
          existRole.save()
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
  describe("ロール更新", function(){
    describe("update", function(){
      context("存在するロールIDを指定し、更新に成功", function(done){
        var updateRole = null;
        before(function(done){
          updateRole = new ncmb.Role("updated_role_name");
          if(!ncmb.stub){
            updateRole.save()
                      .then(function(obj){
                        expect(obj.objectId).to.exist;
                        done();
                      })
                      .catch(function(){
                        done(new Error("前処理に失敗しました。"));
                      });
          }else{
            updateRole.objectId = "update_role_id"
            done();
          }
        });
        it("callback で取得できる", function(done){
          updateRole.update(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.updateDate).to.exist;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          updateRole.update()
              .then(function(obj){
                expect(obj.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("存在しないロールIDを指定し、更新に失敗", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role("updated_role_name", {objectId:"no_exist_role_id"});
        });
        it("callback で取得できる", function(done){
          noExistRole.update(function(err, obj){
            if(err){
              expect(err.code).to.be.eql('E404001');
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.update()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
        });
      });
      context("objectIdがない場合、更新に失敗", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role("updated_role_name");
        });
        it("callback で取得できる", function(done){
          noExistRole.update(function(err, obj){
            if(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.update()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
        });
      });
    });
  });

  describe("ロール削除", function(){
    describe("delete", function(){
      var roleName = "deleted_role_name";
      context("存在したロール名を指定し、削除に成功して", function(done){
        var deleteRole = null;
        beforeEach(function(done){
          deleteRole = new ncmb.Role(roleName);
          if(ncmb.stub){
            deleteRole.objectId = "delete_role_id";
            done();
          }else{
            deleteRole.save()
                      .then(function(obj){
                        expect(obj.objectId).to.exist;
                        done();
                      })
                      .catch(function(){
                        done(new Error("前処理に失敗しました。"));
                      });
          }
        });
        it("callback で取得できる", function(done){
          deleteRole.delete(function(err, obj){
            if(err){
              done(err);
            }else{
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          deleteRole.delete()
              .then(function(){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("存在しないIDを指定し、削除に失敗して", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role(roleName, {objectId: "no_exist_role_id"});
        });
        it("callback で取得できる", function(done){
          noExistRole.delete(function(err, obj){
            if(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.delete()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
        });
      });
      context("objectIdが設定されていないとき、削除に失敗して", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role(roleName);
        });
        it("callback で削除エラーを取得できる", function(done){
          noExistRole.delete(function(err, obj){
            if(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
          });
        });
        it("promise で削除エラーを取得できる", function(done){
          noExistRole.delete()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
        });
      });
    });
  });
  describe("子会員の追加", function(){
    var role = null;
    describe("addUser", function(){
      var user = null;
      var user2 = null;
      before(function(done){
        user = new ncmb.User({userName:userName1, password:userPassword1});
        user2 = new ncmb.User({userName:userName2, password:userPassword2});
        if(!ncmb.stub){
          var acl = new ncmb.Acl();
          acl.setPublicReadAccess(true);
          user.set("acl", acl);
          user2.set("acl", acl);
        }
        user.save()
            .then(function(obj){
              expect(obj.objectId).to.exist;
              belong_user1_id = obj.objectId;
              return user2.save();
            })
            .then(function(obj){
              expect(obj.objectId).to.exist;
              belong_user2_id = obj.objectId;
              done();
            })
            .catch(function(){
              done(new Error("前処理に失敗しました。"));
            });
      })
      context("追加するユーザを指定して登録した結果を取得し、", function(){
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addUserCallback");
          }
          role.addUser(user)
              .save(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.objectId).to.exist;
                  add_user_id = obj.objectId;
                  ncmb.User
                      .relatedTo(obj, "belongUser")
                      .fetchAll()
                      .then(function(obj){
                        expect(obj.length).to.be.eql(1);
                        expect(obj[0].userName).to.be.eql(user.userName);
                        done();
                      })
                      .catch(function(err){
                        done(err);
                      });
                }
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addUserPromise");
          }
          role.addUser(user)
              .save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                return ncmb.User
                           .relatedTo(obj, "belongUser")
                           .fetchAll();
              })
              .then(function(obj){
                expect(obj.length).to.be.eql(1);
                expect(obj[0].userName).to.be.eql(user.userName);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加するユーザを配列で指定して登録した結果を取得し、", function(){
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addUserArrayallback");
          }
          role.addUser([user,user2])
              .save(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.objectId).to.exist;
                  ncmb.User
                      .relatedTo(obj, "belongUser")
                      .fetchAll()
                      .then(function(obj){
                        expect(obj.length).to.be.eql(2);
                        done();
                      })
                      .catch(function(err){
                        done(err);
                      });
                }
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addUserArrayPromise");
          }
          role.addUser([user,user2])
              .save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                return ncmb.User
                           .relatedTo(obj, "belongUser")
                           .fetchAll();
              })
              .then(function(obj){
                expect(obj.length).to.be.eql(2);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加するユーザを連続で指定して登録した結果を取得し、", function(){
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addMultiUserCallback");
          }
          role.addUser(user)
              .addUser(user2)
              .save(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.objectId).to.exist;
                  ncmb.User
                      .relatedTo(obj, "belongUser")
                      .fetchAll()
                      .then(function(obj){
                        expect(obj.length).to.be.eql(2);
                        done();
                      })
                      .catch(function(err){
                        done(err);
                      });
                }
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addMultiUserPromise");
          }
          role.addUser(user)
              .addUser(user2)
              .save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                return ncmb.User
                           .relatedTo(obj, "belongUser")
                           .fetchAll();
              })
              .then(function(obj){
                expect(obj.length).to.be.eql(2);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子ロールの追加", function(){
    var role = null;
    var subrole = null;
    var subrole2 = null;
    describe("addRole", function(){
      before(function(done){
        subrole = new ncmb.Role("subRole");
        subrole2 = new ncmb.Role("subRole2");
        subrole.save()
               .then(function(obj){
                 expect(obj.objectId).to.exist;
                 belong_role1_id = obj.objectId;
                 return subrole2.save();
               })
               .then(function(obj){
                 expect(obj.objectId).to.exist;
                 belong_role2_id = obj.objectId;
                 done();
               })
               .catch(function(){
                 done(new Error("前処理に失敗しました。"));
               });
      });
      context("追加するロールを指定して登録した結果を取得し、", function(){
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addRoleCallback");
          }
          role.addRole(subrole)
              .save(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.objectId).to.exist;
                  add_role_id = obj.objectId;
                  ncmb.Role
                  .relatedTo(obj, "belongRole")
                  .fetchAll()
                  .then(function(obj){
                    expect(obj.length).to.be.eql(1);
                    expect(obj[0].roleName).to.be.eql(subrole.roleName);
                    done()
                  })
                  .catch(function(err){
                    done(err);
                  });
                }
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addRolePromise");
          }
          role.addRole(subrole)
              .save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                return ncmb.Role
                           .relatedTo(obj, "belongRole")
                           .fetchAll();
              })
              .then(function(obj){
                expect(obj.length).to.be.eql(1);
                expect(obj[0].roleName).to.be.eql(subrole.roleName);
                done()
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加する子ロールを配列で指定して登録した結果を取得し、", function(){
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addRoleArrayCallback");
          }
          role.addRole([subrole,subrole2])
              .save(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.objectId).to.exist;
                  ncmb.Role
                      .relatedTo(obj, "belongRole")
                      .fetchAll()
                      .then(function(obj){
                        expect(obj.length).to.be.eql(2);
                        done();
                      })
                      .catch(function(err){
                        done(err);
                      });
                }
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addRoleArrayPromise");
          }
          role.addRole([subrole,subrole2])
              .save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                return ncmb.Role
                           .relatedTo(obj, "belongRole")
                           .fetchAll();
              })
              .then(function(obj){
                expect(obj.length).to.be.eql(2);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加する子ロールを連続で指定して登録した結果を取得し、", function(){
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addMultiRoleCallback");
          }
          role.addRole(subrole)
              .addRole(subrole2)
              .save(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.objectId).to.exist;
                  ncmb.Role
                      .relatedTo(obj, "belongRole")
                      .fetchAll()
                      .then(function(obj){
                        expect(obj.length).to.be.eql(2);
                        done();
                      })
                      .catch(function(err){
                        done(err);
                      });
                }
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("addMultiRolePromise");
          }
          role.addRole(subrole)
              .addRole(subrole2)
              .save()
              .then(function(obj){
                expect(obj.objectId).to.exist;
                return ncmb.Role
                           .relatedTo(obj, "belongRole")
                           .fetchAll();
              })
              .then(function(obj){
                expect(obj.length).to.be.eql(2);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子会員の取得", function(){
    context("fetchUser", function(){
      context("ロールが持つ子会員を検索し、結果を", function(){
        var role = null;
        before(function(){
          role = new ncmb.Role("mainRole");
          if(ncmb.stub){
            role.objectId = "role_id";
          }else{
            role.objectId = add_user_id;
          }
        });
        it("callback で取得できる", function(done){
          role.fetchUser(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.length).to.be.eql(1);
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.fetchUser()
              .then(function(obj){
                expect(obj.length).to.be.eql(1);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子ロールの取得", function(){
    context("fetchRole", function(){
      context("ロールが持つ子ロールを検索し、結果を", function(){
        var role = null;
        before(function(){
          role = new ncmb.Role("mainRole");
          if(ncmb.stub){
            role.objectId = "role_id";
          }else{
            role.objectId = add_role_id;
          }
        });
        it("callback で取得できる", function(done){
          role.fetchRole(function(err, obj){
                if(err){
                  done(err);
                }else{
                  expect(obj.length).to.be.eql(1);
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.fetchRole()
              .then(function(obj){
                expect(obj.length).to.be.eql(1);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子会員の削除", function(){
    var role = null;
    describe("removeUser", function(){
      context("削除するユーザを指定して更新した結果を取得し、", function(){
        var user = null;
        before(function(){
          user = new ncmb.User({userName:userName1, password:userPassword1});
          user.objectId = belong_user1_id;
        });
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeUserCallback");
          }
          role.addUser(user)
              .save()
              .then(function(obj){
                obj.removeUser(user)
                   .update(function(err, obj){
                     if(err){
                       done(err);
                     }else{
                       expect(obj.updateDate).to.exist;
                       done();
                     }
                   });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeUserPromise");
          }
          role.addUser(user)
              .save()
              .then(function(obj){
                obj.removeUser(user);
                return obj.update();
              })
              .then(function(obj){
                expect(obj.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するユーザを配列で指定して更新した結果を取得し、", function(){
        var user = null;
        var user2 = null;
        before(function(){
          user = new ncmb.User({userName:userName1, password:userPassword1});
          user2 = new ncmb.User({userName:userName2, password:userPassword2});
          if(!ncmb.stub){
            user.objectId = belong_user1_id;
            user2.objectId = belong_user2_id;
          }
        });
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeUserArrayCallback");
          }
          role.addUser([user,user2])
              .save()
              .then(function(obj){
                obj.removeUser([user,user2])
                   .update(function(err, obj){
                     if(err){
                       done(err);
                     }else{
                       expect(obj.updateDate).to.exist;
                       done();
                     }
                   });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeUserArrayPromise");
          }
          role.addUser([user,user2])
              .save()
              .then(function(obj){
                obj.removeUser([user,user2]);
                return obj.update();
              })
              .then(function(obj){
                expect(obj.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するユーザを連続で指定して更新した結果を取得し、", function(){
        var user = null;
        var user2 = null;
        before(function(){
          user = new ncmb.User({userName:userName1, password:userPassword1});
          user2 = new ncmb.User({userName:userName2, password:userPassword2});
          user.objectId = belong_user1_id;
          user2.objectId = belong_user2_id;
        });
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeMultiUserCallback");
          }
          role.addUser([user,user2])
              .save()
              .then(function(obj){
                obj.removeUser(user)
                   .removeUser(user2)
                   .update(function(err, obj){
                     if(err){
                       done(err);
                     }else{
                       expect(obj.updateDate).to.exist;
                       done();
                     }
                   });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeMultiUserPromise");
          }
          role.addUser([user,user2])
              .save()
              .then(function(obj){
                obj.removeUser(user)
                   .removeUser(user2);
                return obj.update();
              })
              .then(function(obj){
                expect(obj.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子ロールの削除", function(){
    var role = null;
    describe("removeRole", function(){
      context("削除するロールを指定して更新した結果を取得し、", function(){
        var subrole = null;
        before(function(){
          subrole = new ncmb.Role("subRole");
          subrole.objectId = belong_role1_id;
        });
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeRoleCallback");
          }
          role.addRole(subrole)
              .save()
              .then(function(obj){
                obj.removeRole(subrole)
                   .update(function(err, obj){
                     if(err){
                       done(err);
                     }else{
                       expect(obj.updateDate).to.exist;
                       done();
                     }
                   });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeRolePromise");
          }
          role.addRole(subrole)
              .save()
              .then(function(obj){
                obj.removeRole(subrole);
                return obj.update();
              })
              .then(function(obj){
                expect(obj.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するロールを配列で指定して更新した結果を取得し、", function(){
        var subrole = null;
        var subrole2 = null;
        before(function(){
          subrole = new ncmb.Role("subRole");
          subrole2 = new ncmb.Role("subRole2");
          subrole.objectId = belong_role1_id;
          subrole2.objectId = belong_role2_id;
        });
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeRoleArrayCallback");
          }
          role.addRole([subrole,subrole2])
              .save()
              .then(function(obj){
                obj.removeRole([subrole,subrole2])
                   .update(function(err, obj){
                     if(err){
                       done(err);
                     }else{
                       expect(obj.updateDate).to.exist;
                       done();
                     }
                   });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeRoleArrayPromise");
          }
          role.addRole([subrole,subrole2])
              .save()
              .then(function(obj){
                obj.removeRole([subrole,subrole2]);
                return obj.update();
              })
              .then(function(obj){
                expect(obj.updateDate).to.exist;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するロールを連続で指定して更新した結果を取得し、", function(){
        var subrole = null;
        var subrole2 = null;
        before(function(){
          subrole = new ncmb.Role("subRole");
          subrole2 = new ncmb.Role("subRole2");
          subrole.objectId = belong_role1_id;
          subrole2.objectId = belong_role2_id;
        });
        it("callback で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeMultiRoleCallback");
          }
          role.addRole([subrole,subrole2])
              .save()
              .then(function(obj){
                obj.removeRole(subrole)
                   .removeRole(subrole2)
                   .update(function(err, obj){
                     if(err){
                       done(err);
                     }else{
                       expect(obj.updateDate).to.exist;
                       done();
                     }
                   });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          if(ncmb.stub){
            role = new ncmb.Role("mainRole");
          }else{
            role = new ncmb.Role("removeRoleMultiPromise");
          }
          role.addRole([subrole,subrole2])
              .save()
              .then(function(obj){
                obj.removeRole(subrole)
                   .removeRole(subrole2);
                return obj.update();
              })
              .then(function(obj){
                expect(obj.updateDate).to.exist;
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
