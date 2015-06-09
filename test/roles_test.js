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

  describe("ロール登録", function(){
    describe("save", function(){
      context("存在しないロール名を指定し、登録に成功", function(done){
        var newRole = null;
        before(function(){
          newRole = new ncmb.Role({roleName: "new_role_name"});
        });
        it("callback で取得できる", function(done){
          newRole.save(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          newRole.save()
              .then(function(newRole){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });         
      });
      context("存在したロール名を指定し、登録に失敗", function(){
         
      });
    });
  });
});