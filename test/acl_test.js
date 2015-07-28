"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB   = require("../lib/ncmb");
var errors = require("../lib/errors");

describe("NCMB ACL", function(){
    var ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb
        .set("protocol", config.apiserver.protocol || "http:")
        .set("fqdn", config.apiserver.fqdn)
        .set("port", config.apiserver.port)
        .set("proxy", config.apiserver.port || "");
    }

    var aclObj = null;
    it("権限をconstructorで指定し、取得できる", function() {
      aclObj = new ncmb.Acl({"*":{read: true}});
      expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
    });

    describe("権限をプロパティで指定し、取得できる", function() {
      beforeEach(function(){
        aclObj = new ncmb.Acl();
      });
      it("permisionをオブジェクトで指定", function() {
        aclObj["*"] = {read: true};
        expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
      });
      it("permisionをパラメータで指定", function() {
        aclObj["*"] = {};
        aclObj["*"].read = true;
        expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
      });
    });

    describe("権限の設定チェック", function() {
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
          it("Read, Writeをchain指定し、取得できる", function() {
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
          it("Read, Writeをchain指定し、取得できる", function() {
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
      var role = null;
      describe("Role権限に対して", function(){
        context("第一引数にrole名が設定される場合", function(){
          beforeEach(function(){
            aclObj = new ncmb.Acl();
            role = "roleName"
          });
          it("Readを指定し、取得できる", function() {
            aclObj.setRoleReadAccess(role, true);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true}});
          });
          it("Writeを指定し、取得できる", function() {
            aclObj.setRoleWriteAccess(role, true);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: true}});
          });
          it("Write, Readを指定し、取得できる", function() {
            aclObj.setRoleReadAccess(role, true);
            aclObj.setRoleWriteAccess(role, true);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: true}});
          });
          it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setRoleWriteAccess(role, true);
            aclObj.setRoleWriteAccess(role, false);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: false}});
          });
          it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setRoleReadAccess(role, true);
            aclObj.setRoleReadAccess(role, false);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: false}});
          });
          it("Read, Writeをchain指定し、取得できる", function() {
            aclObj.setRoleReadAccess(role, true).setRoleWriteAccess(role, false);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: false}});
          });
        });
        context("第一引数のrole名が不正な場合", function(){
          beforeEach(function(){
            aclObj = new ncmb.Acl();
            role = new ncmb.Role({roleName:"roleName"});
          });
          it("role名にnullを指定した場合、エラーを返す", function() {
            expect(function(){ aclObj.setRoleReadAccess(null, true); }).to.throw(errors.NoRoleNameError);
          });
          it("role名にundefinedを指定した場合、エラーを返す", function() {
            expect(function(){ aclObj.setRoleReadAccess(undefined, true); }).to.throw(errors.NoRoleNameError);
          });
          it("role名に空文字を指定した場合、エラーを返す", function() {
            expect(function(){ aclObj.setRoleReadAccess("", true); }).to.throw(errors.NoRoleNameError);
          });
          it("role名にroleNameがないオブジェクトを指定した場合、エラーを返す", function() {
            expect(function(){ aclObj.setRoleReadAccess({}, true); }).to.throw(errors.NoRoleNameError);
          });
          it("role名にroleNameがnullのroleオブジェクトを指定した場合、エラーを返す", function() {
            role.roleName = null;
            expect(function(){ aclObj.setRoleReadAccess(role, true); }).to.throw(errors.NoRoleNameError);
          });
          it("role名にroleNameがundefinedのroleオブジェクトを指定した場合、エラーを返す", function() {
            role.roleName = undefined;
            expect(function(){ aclObj.setRoleReadAccess(role, true); }).to.throw(errors.NoRoleNameError);
          });
          it("role名にroleNameがないroleオブジェクトを指定した場合、エラーを返す", function() {
            delete role.roleName;
            expect(function(){ aclObj.setRoleReadAccess(role, true); }).to.throw(errors.NoRoleNameError);
          });
          it("role名にroleNameが空文字のroleオブジェクトを指定した場合、エラーを返す", function() {
            role.roleName = "";
            expect(function(){ aclObj.setRoleReadAccess(role, true); }).to.throw(errors.NoRoleNameError);
          });
        });
        context("第一引数にroleインスタンスが設定される場合", function(){
          beforeEach(function(){
            aclObj = new ncmb.Acl();
            role = new ncmb.Role({roleName:"roleName"});
          });
          it("Readを指定し、取得できる", function() {
            aclObj.setRoleReadAccess(role, true);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true}});
          });
          it("Writeを指定し、取得できる", function() {
            aclObj.setRoleWriteAccess(role, true);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: true}});
          });
          it("Write, Readを指定し、取得できる", function() {
            aclObj.setRoleReadAccess(role, true);
            aclObj.setRoleWriteAccess(role, true);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: true}});
          });
          it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setRoleWriteAccess(role, true);
            aclObj.setRoleWriteAccess(role, false);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: false}});
          });
          it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
            aclObj.setRoleReadAccess(role, true);
            aclObj.setRoleReadAccess(role, false);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: false}});
          });
          it("Read, Writeをchain指定し、取得できる", function() {
            aclObj.setRoleReadAccess(role, true).setRoleWriteAccess(role, false);
            expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: false}});
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
