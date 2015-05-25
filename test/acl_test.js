"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB ACL", function(){
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

    describe("default check", function() {
      var aclObj = new ncmb.Acl();
      it("Public Read check", function(done) {
        aclObj.setPublicReadAccess(true);
        expect(aclObj.toJSON()).to.be.eql({'*':{read: true}});
        done();
      });
      it("Public Write check", function(done) {
        aclObj.setPublicWriteAccess(true);
        expect(aclObj.toJSON()).to.be.eql({'*':{write: true}});
        done();
      });
    });

    describe("ACLデータが入っている状態で保存成功", function() {
      var Food = ncmb.DataStore("food");
      var aclObj = new ncmb.Acl();
      aclObj.setPublicReadAccess(true);
      var food = new Food({name: "orange", acl: aclObj});
      it("callback で取得できる", function(done){
        food.save(function(err, obj){
          if(err) {
            done(err);
          } else {
            Food.where({objectId: obj.objectId}).fetchAll()
            .then(function(foods){
              expect(foods[0].acl).to.be.eql({'*':{read: true}});
              done();
            });
          }
        });
      });
      it("promise で取得できる", function(done){
        food.save()
          .then(function(newFood){
            Food.where({objectId: newFood.objectId}).fetchAll()
            .then(function(foods){
              expect(foods[0].acl).to.be.eql({'*':{read: true}});
              done();
            });
          })
          .catch(function(err){
            done(err);
          });
      });
    });
});

