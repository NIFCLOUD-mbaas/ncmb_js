"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB ACL", function(){
    var ncmb = new NCMB();
    describe("default check", function() {
      var aclObject1 = new ncmb.Acl();
 
      it("Public Read check", function(done) {
        aclObject1.setPublicReadAccess();
        console.log(aclObject1._toJSON());
        done();
      });
    });
});