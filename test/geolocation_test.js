"use strict";

var config   = require("config");
var expect   = require("chai").expect;
var _        = require("lodash");

var NCMB = require("../lib/ncmb");

describe("NCMB Geolocation", function(){
  var ncmb = null;

  before(function(){
    ncmb = new NCMB();
    ncmb
    .set("apikey",     config.apikey)
    .set("clientkey" , config.clientkey);
    if(config.apiserver){
      ncmb
      .set("protocol", config.apiserver.protocol || "http:")
      .set("fqdn",     config.apiserver.fqdn)
      .set("port",     config.apiserver.port)
      .set("proxy",    config.apiserver.port || "");
    }
  });

  describe("コンストラクタ", function(){
    var lats = [-90, -45.5, 0, 45, 45.5, 90],
        lngs = [-180, -90.0, -90, 0, 90, 90.0, 180];
    var successCases = _.flatten(lats.map(function(lat){
      return lngs.map(function(lng){
        return [lat, lng];
      });
    }));
    var failuerCases = _.flatten([
      ["latitude", -100, null, 100].map(function(lat){
        return lngs.map(function(lng){ return [lat, lng]; });
      }),
      lats.map(function(lat){
        return ["longitude", -200, null, 200].map(function(lng){ return [lat, lng]; });
      }),
    ]);

    context("引数無しの場合", function(){
      it("{latitude: 0, longitude: 0} のオブジェクトが取得できる", function(){
        var geo = new ncmb.Geolocation();
        expect(geo).to.have.property("latitude", 0);
        expect(geo).to.have.property("longitude", 0);
      });
    });

    [
      { name: "引数を 2 つ渡した場合",
        create: function(dat){ return new ncmb.Geolocation(dat[0], dat[1]);}},
      { name: "引数を 2 要素配列で渡した場合",
        create: function(dat){ return new ncmb.Geolocation(dat);}},
      { name: "引数をオブジェクトで渡した場合",
        create: function(dat){ return new ncmb.Geolocation({
          latitude: dat[0], longitude: dat[1]});}}
    ].forEach(function(argCase){
      describe("正常データを", function(){
        context(argCase.name, function(){
          it("正常に取得できる", function(){
            successCases.forEach(function(pos){
              var geo = argCase.create(pos);
              expect(geo).to.have.property("latitude", pos[0]);
              expect(geo).to.have.property("longitude", pos[1]);
            });
          });
        });
      });
      describe("異常データを", function(){
        context(argCase.name, function(){
          it("エラーを捕捉できる", function(){
            failuerCases.forEach(function(pos){
              try{
                new ncmb.Geolocation(pos[0], pos[1]);
                throw new Error("エラーが出ない");
              }catch(err){
                expect(err).to.be.an.instanceof(Error);
                return;
              }
            });
          });
        });
      });
    });
  });

  describe("Geolocation データを保存し", function(){
    context("成功した場合に", function(){
      var Food = null;
      var geo  = null;
      before(function(){
        Food = ncmb.DataStore("food");
        geo = new ncmb.Geolocation(12,133);
      });

      it("callback で取得できる", function(done){
        new Food({geoLocation: geo}).save(function(err, food){
          if(err) return done(err);
          expect(food).to.be.an.instanceof(Food);
          done();
        });
      });
      it("promise で取得できる", function(done){
        new Food({geoLocation: geo}).save().then(function(food){
          expect(food).to.be.an.instanceof(Food);
          done();
        }).catch(done);
      });
    });
  });
});
