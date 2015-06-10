"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");

describe("NCMB Files", function(){
  var ncmb = null;

  before(function(){
    ncmb = new NCMB();
    ncmb.set("apikey", config.apikey)
        .set("clientkey", config.clientkey);
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });

  describe("ファイル取得", function(){
    context("クラスメソッドで呼び出し", function(){
      context("成功した場合", function(){
        it("callback でレスポンスを取得できる", function(done){
          ncmb.File.fetch("fetch_file.text", function(err, file){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          ncmb.File.fetch("fetch_file.text")
          .then(function(file){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("失敗した理由が", function(){
        context("fileName がないときに", function(){

          it("callback で取得時エラーを取得できる", function(done){
            ncmb.File.fetch(null, function(err, file){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise で取得時エラーを取得できる", function(done){
            ncmb.File.fetch()
            .then(function(file){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
      });
    });

    context("インスタンスメソッドで呼び出し", function(){
      var file = null;
      before(function(){
        file = new ncmb.File();
      });

      context("成功した場合", function(){
        beforeEach(function(){
          file["fileName"] = "fetch_file.text";
        });
        it("callback でレスポンスを取得できる", function(done){
          file.fetch(function(err, data){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          file.fetch()
          .then(function(data){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("失敗した理由が", function(){
        beforeEach(function(){
          file["fileName"] = null;
        });
        context("fileName がないときに", function(){
          it("callback で取得時エラーを取得できる", function(done){
            file.fetch(function(err, data){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise で取得時エラーを取得できる", function(done){
            file.fetch()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
      });
    });
  });

  describe("ファイル削除", function(){
    context("成功した場合", function(){

      it("callback でレスポンスを取得できる", function(done){
        ncmb.File.delete("del_file.text", function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.File.delete("del_file.text")
        .then(function(){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("fileName がないときに", function(){

        it("callback で削除時エラーを取得できる", function(done){
          ncmb.File.delete(null, function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で削除時エラーを取得できる", function(done){
          ncmb.File.delete(null)
          .then(function(){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });
    });
  });
});
