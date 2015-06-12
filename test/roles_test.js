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
      it("ロール名を指定せず、登録に失敗", function(done){
        expect(function(){
          new ncmb.Role();
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role({});
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role({roleName: undefined});
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role({roleName: null});
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role({roleName: ""});
        }).to.throw(Error);
        done();
      });
      context("存在しないロール名を指定し、登録に成功", function(){
        var newRole = null;
        beforeEach(function(){
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
        var newExistRole = null;
        before(function(){
          newExistRole = new ncmb.Role({roleName: "new_exist_role_name"});
        });
        it("callback で取得できる", function(done){
          newExistRole.save(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            expect(err.status).to.be.eql(409);
            done();
          });
        });
        it("promise で取得できる", function(done){
          newExistRole.save()
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
