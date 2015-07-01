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

    describe("権限の設定チェック", function() {
      var aclObj = null;
      describe("Public権限に対して", function(){
        context("正しく設定される場合", function(){
          beforeEach(function(){
            aclObj = new ncmb.Acl();
          });
          it("Readを指定し、取得できる", function() {
            aclObj.setPublicReadAccess(true);
            expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
          });
          it("Writeを指定し、取得できる", function() {
            aclObj.setPublicWriteAccess(true);
            expect(aclObj.toJSON()).to.be.eql({"*":{write: true}});
          });
          it("Write, Readを指定し、取得できる", function() {
            aclObj.setPublicReadAccess(true);
            aclObj.setPublicWriteAccess(true);
            expect(aclObj.toJSON()).to.be.eql({"*":{read: true, write: true}});
          });
          it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setPublicWriteAccess(true);
            aclObj.setPublicWriteAccess(false);
            expect(aclObj.toJSON()).to.be.eql({"*":{write: false}});
          });
          it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setPublicReadAccess(true);
            aclObj.setPublicReadAccess(false);
            expect(aclObj.toJSON()).to.be.eql({"*":{read: false}});
          });
          it("Read , Writeをchain指定し、取得できる", function() {
            aclObj.setPublicReadAccess(true).setPublicWriteAccess(false);
            expect(aclObj.toJSON()).to.be.eql({"*":{read: true, write: false}});
          });
        });
        context("設定に失敗した理由が", function(){
          beforeEach(function(){
            aclObj = new ncmb.Acl();
          });

        });
      });

      var user = null;
      describe("User権限に対して", function(){
        context("正しく設定される場合", function(){
          beforeEach(function(){
            aclObj = new ncmb.Acl();
            user = new ncmb.User({objectId: "object_id"});
          });
          it("Readを指定し、取得できる", function() {
            aclObj.setUserReadAccess(user, true);
            expect(aclObj.toJSON()).to.be.eql({"object_id":{read: true}});
          });
          it("Writeを指定し、取得できる", function() {
            aclObj.setUserWriteAccess(user, true);
            expect(aclObj.toJSON()).to.be.eql({"object_id":{write: true}});
          });
          it("Write, Readを指定し、取得できる", function() {
            aclObj.setUserReadAccess(user, true);
            aclObj.setUserWriteAccess(user, true);
            expect(aclObj.toJSON()).to.be.eql({"object_id":{read: true, write: true}});
          });
          it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setUserWriteAccess(user, true);
            aclObj.setUserWriteAccess(user, false);
            expect(aclObj.toJSON()).to.be.eql({"object_id":{write: false}});
          });
          it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setUserReadAccess(user, true);
            aclObj.setUserReadAccess(user, false);
            expect(aclObj.toJSON()).to.be.eql({"object_id":{read: false}});
          });
          it("Read , Writeをchain指定し、取得できる", function() {
            aclObj.setUserReadAccess(user, true).setUserWriteAccess(user, false);
            expect(aclObj.toJSON()).to.be.eql({"object_id":{read: true, write: false}});
          });
        });
        context("権限の設定に失敗した理由が", function(){
          context("ユーザのobjectIdがない時", function(){
            beforeEach(function(){
              aclObj = new ncmb.Acl();
              user = new ncmb.User();
            });
            it("Read権限の設定時にエラーを取得できる", function(done) {
              try{
                aclObj.setUserReadAccess(user, true);
                done(new Error("失敗すべき"));
              }catch(err){
                done();
              }
            });
            it("Write権限の設定時にエラーを取得できる", function(done) {
              try{
                aclObj.setUserWriteAccess(user, true);
                done(new Error("失敗すべき"));
              }catch(err){
                done();
              }
            });
          });
        });
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

