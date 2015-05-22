"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Push", function(){
  it("create push", function(done){
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

    var p = new ncmb.Push({immediateDeliveryFlag: true});
    p.send().then(function(push){
      done();
    }).catch(function(err){
      done(err);
    });
  });
});
