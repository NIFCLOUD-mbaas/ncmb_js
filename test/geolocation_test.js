"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Geolocation", function(){
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

  describe("Geolocation正常設定", function(){
    var geoObject1 = new ncmb.Geolocation();   // defaults to (0,0)
  	var geoObject2 = new ncmb.Geolocation(12,133);
  	var geoObject3 = new ncmb.Geolocation(30.0, 30.0);
  	var geoObject4 = new ncmb.Geolocation([30.0, 30.0]);
  	var geoObject5 = new ncmb.Geolocation({latitude: 30.0, longitude: 30.0});
    
    it("default check", function(done){
      expect(geoObject1.latitude).to.be.eql(0);
      expect(geoObject1.longitude).to.be.eql(0);
      done();
    });

    it("set integer check", function(done){
      expect(geoObject2.latitude).to.be.eql(12);
      expect(geoObject2.longitude).to.be.eql(133);
      done();
    });

    it("set float check", function(done){
      expect(geoObject3.latitude).to.be.eql(30.0);
      expect(geoObject3.longitude).to.be.eql(30.0);
      done();
    });

    it("set array check", function(done){
      expect(geoObject4.latitude).to.be.eql(30.0);
      expect(geoObject4.longitude).to.be.eql(30.0);
      done();
    });

    it("set json check", function(done){
      expect(geoObject5.latitude).to.be.eql(30.0);
      expect(geoObject5.longitude).to.be.eql(30.0);
      done();
    });
  });

  describe("Geolocation異常設定", function(){
    it("longitude latitude not number error ", function(done){
      try {
        var invalidGeoObject0 = new ncmb.Geolocation("aaa", "bbb");
      }
      catch(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      }
    });

    it("latitude < -90 Error ", function(done){
      try {
        var invalidGeoObject1 = new ncmb.Geolocation(-90.1, 0);
      }
      catch(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      }
    });

    it("latitude > 90 Error ", function(done){
      try {
        var invalidGeoObject2 = new ncmb.Geolocation(90.1, 0);
      }
      catch(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      }
    });

    it("longitude < -180 Error ", function(done){
      try {
        var invalidGeoObject3 = new ncmb.Geolocation(0, -180.1);
      }
      catch(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      }
    });

    it("longitude > 180 Error ", function(done){
      try {
        var invalidGeoObject4 = new ncmb.Geolocation(0, 180.1);
      }
      catch(err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      }
    });
  });

  describe("Geolocationデータを保存成功", function(){
      context("geolocationデータタイプを指定し、オブジェクト保存に成功", function(){
        var Food = ncmb.DataStore("food");
        var aSimpleGeolocation = new ncmb.Geolocation(12,133);
        var food = new Food({geoLocation: aSimpleGeolocation});
        it("callback で取得できる", function(done){
          food.save(function(err, obj){
            if(err) {
              done(err);
            } else {
              Food.where({objectId: obj.objectId}).fetchAll()
              .then(function(foods){
                expect(foods[0].geoLocation).to.be.eql({"__type":"GeoPoint","longitude":133,"latitude":12});
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
                  expect(foods[0].geoLocation).to.be.eql({"__type":"GeoPoint","longitude":133,"latitude":12});
                  done();
                });
              })
              .catch(function(err){
                done(err);
              });
        });
      });
  });
});