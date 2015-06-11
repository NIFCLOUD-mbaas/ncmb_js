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

  describe("ロール削除", function(){
    describe("delete", function(){
      context("存在したロール名を指定し、削除に成功", function(done){
        var deleteRole = null;
        beforeEach(function(){
          deleteRole = new ncmb.Role({objectId: "delete_role_id"});
        });
        it("callback で取得できる", function(done){
          deleteRole.delete(function(err, obj){
            done(err ? err : null);
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
      context("存在しないロール名を指定し、削除に失敗", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role({objectId: "no_exist_role_id"});
        });
        it("callback で取得できる", function(done){
          noExistRole.delete(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            expect(err.status).to.be.eql(404);
            done();
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.delete()
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