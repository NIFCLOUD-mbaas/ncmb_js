"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");

describe("NCMB Files", function(){
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

  describe("ファイル取得", function(){
    context("成功した場合", function(){
      var get_file = new ncmb.File({fileName: "file.text"});

      it("callback でレスポンスを取得できる", function(done){
        get_file.getfile(function(err, text){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        get_file.getfile()
        .then(function(text){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("fileName がないときに", function(){
        var get_file = new ncmb.File({});

        it("callback で取得時エラーを取得できる", function(done){
          get_file.getfile(function(err, text){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で取得時エラーを取得できる", function(done){
          get_file.getfile()
          .then(function(text){
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

  describe("ファイル削除", function(){
    context("成功した場合", function(){
      var del_file = new ncmb.File({fileName: "del_file.text"});

      it("callback でレスポンスを取得できる", function(done){
        del_file.delete(function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        del_file.delete()
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
        var del_file = new ncmb.File({});

        it("callback で削除時エラーを取得できる", function(done){
          del_file.delete(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で削除時エラーを取得できる", function(done){
          del_file.delete()
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

