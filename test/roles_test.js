"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Role", function(){
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

  describe("ロール更新", function(){
    describe("update", function(){
      context("存在するロールIDを指定し、登録に成功", function(done){
        var updateRole = null;
        beforeEach(function(){
          updateRole = new ncmb.Role({objectId:"update_role_id", roleName:"updated_role_name"});
        });
        it("callback で取得できる", function(done){
          updateRole.update(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          updateRole.update()
              .then(function(updateRole){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });         
      });
      context("存在しないロールIDを指定し、登録に失敗", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role({objectId:"no_exist_role_id", roleName:"updated_role_name"});
        });
        it("callback で取得できる", function(done){
          noExistRole.update(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            expect(err.status).to.be.eql(404);
            done();
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.update()
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
});