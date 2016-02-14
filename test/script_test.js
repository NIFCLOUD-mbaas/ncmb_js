"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Script", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey);
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.port || "");
     }
  });
  describe("Script実行", function(){
    context("GETメソッドで実行に成功", function(done){
      it("callbackで取得できる", function(done){

      });
      it("promiseで取得できる", function(done){

      });
    });
  });
});
