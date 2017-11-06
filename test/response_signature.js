"use strict";

var config   = require("config");
var expect   = require("chai").expect;
var NCMB     = require("../lib/ncmb");
var signature = require("../lib/signature");

(typeof window !== "undefined" ? describe.skip : describe)("NCMB Request", function(){
  describe("", function(){
    var ncmb = null;
    before(function(){
      ncmb = new NCMB("43c89d07ab179888e51d06d76e93be79fcb03807ca363266084accf861644879", "8d9f39637a51517ef75f203df7081a18aeb49b9abaf6d3746f00d80a27fa2e1f" );
      ncmb.enableResponseValidation(false);
    });

    it("レスポンスシグネチャチェック", function(done){
      ncmb.enableResponseValidation(true);
      ncmb.request({
        path: "/"+ncmb.version+"/classes/TessClass"
      }, function(err, body){
        ncmb.enableResponseValidation(false);
        if(err) return done(err);
        return done();
      });
    });

  });
});
