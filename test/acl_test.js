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

    describe("権限をconstructorで指定し、取得できる", function() {
      it("permisionnのJSON指定", function() {
        var aclObj = new ncmb.Acl({"*":{read: true}});
        expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
      });
    });

    describe("権限を設定チェック", function() {
      it("Public Readを指定し、取得できる", function() {
        var aclObj1 = new ncmb.Acl();
        aclObj1.setPublicReadAccess(true);
        expect(aclObj1.toJSON()).to.be.eql({"*":{read: true}});
      });
      it("Public Writeを指定し、取得できる", function() {
        var aclObj2 = new ncmb.Acl();
        aclObj2.setPublicWriteAccess(true);
        expect(aclObj2.toJSON()).to.be.eql({"*":{write: true}});
      });
      it("Public Write, Public Readを指定し、取得できる", function() {
        var aclObj = new ncmb.Acl();
        aclObj.setPublicReadAccess(true);
        aclObj.setPublicWriteAccess(true);
        expect(aclObj.toJSON()).to.be.eql({"*":{read: true, write: true}});
      });
      it("Public Write true, Public Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
        var aclObj = new ncmb.Acl();
        aclObj.setPublicWriteAccess(true);
        aclObj.setPublicWriteAccess(false);
        expect(aclObj.toJSON()).to.be.eql({"*":{write: false}});
      });
      it("Public Read true, Public Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
        var aclObj = new ncmb.Acl();
        aclObj.setPublicReadAccess(true);
        aclObj.setPublicReadAccess(false);
        expect(aclObj.toJSON()).to.be.eql({"*":{read: false}});
      });
      it("Public Read true, Public Read falseをchain指定し、最後に指定したfalseを取得できる", function() {
        var aclObj = new ncmb.Acl();
        aclObj.setPublicReadAccess(true).setPublicWriteAccess(false);
        expect(aclObj.toJSON()).to.be.eql({"*":{read: true, write: false}});
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

