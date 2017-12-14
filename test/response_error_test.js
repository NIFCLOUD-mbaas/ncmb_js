"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Response error", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
  });


  describe("低レベル リクエスト API", function(){
    var user = null;
    var userName = null;
    var password = null;
    before(function(){
      ncmb
      .set("apikey", config.apikey)
      .set("clientkey", config.clientkey);
      if(config.apiserver){
        ncmb
        .set("protocol", config.apiserver.protocol)
        .set("fqdn", config.apiserver.fqdn)
        .set("port", config.apiserver.port)
        .set("proxy", config.apiserver.proxy || "")
        .set("stub", config.apiserver.stub);
      }
    });

    context("test response error No such application", function(){
      var TestClassError = null;
      var testClassError = null;
      beforeEach(function(){
        TestClassError = ncmb.DataStore("TestClassError");
        testClassError = new TestClassError({key: "value"});
      });
      it("callback test response error", function(done){
        testClassError.save(function(err, obj){
          if(err){
            expect(err.error).to.equal('No such application.');
            done();
          }else{
            done();
          }
        });
      });
      it("promise test response error", function(done){
        testClassError.save()
            .then(function(obj){
              done();
            })
            .catch(function(err){
              expect(err.error).to.equal('No such application.');
              done();
            });
      });
    });

    context("test response error login ", function(){
      beforeEach(function(){
        userName = "wronguser"
        password = "wrongpassword";
        user = new ncmb.User({userName: userName,password: password});
      });
     
      it("callback error login", function(done){
        ncmb.User.login(user, function(err, data){
          if(!err){
            done();
          }else{
            expect(err.error).to.equal('Authentication error with ID/PASS incorrect.');
            done();
          }
        });
      });

      it("promise error login", function(done){
        ncmb.User.login(user)
        .then(function(data){
          done();
        })
        .catch(function(err){
          expect(err.error).to.equal('Authentication error with ID/PASS incorrect.');
          done();
        });
      });
    });


  });
});
