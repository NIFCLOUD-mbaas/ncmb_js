"use strict";

var config = require("config");
var expect = require("chai").expect;
var NCMB = require("../lib/ncmb");
var fs = require("fs");

(typeof window !== "undefined" ? describe.skip : describe)("NCMB Files", function(){
  var ncmb = null;

  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });

  describe("ファイル保存", function(){
    var fileName = null;
    var filePath = null;
    before(function(){
      fileName = "upload.text";
      filePath = "./test/files/test.text";
    });
    context("upload", function(){
      context("成功した場合", function(){
        it("callback でレスポンスを取得できる", function(done){
          fs.readFile(filePath, function(err, data){
            if(err){
              done(err);
            }else{
              ncmb.File.upload(fileName, data, function(err, file){
                if(err){
                  done(err);
                }else{
                  expect(file.fileName).to.be.eql(fileName);
                  done();
                }
              });
            }
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          fs.readFile(filePath, function(err, data){
            if(err){
              done(err);
            }else{
              ncmb.File.upload(fileName, data)
              .then(function(file){
                expect(file.fileName).to.be.eql(fileName);
                done();
              })
              .catch(function(err){
                done(err);
              });
            }
          });
        });
      });
      context("ACLを付加して保存でき、", function(){
        var acl = null;
        beforeEach(function(){
          acl = new ncmb.Acl();
          acl.setPublicReadAccess(true);
        });
        it("callback でレスポンスを取得できる", function(done){
          fs.readFile(filePath, function(err, data){
            if(err){
              done(err);
            }else{
              ncmb.File.upload(fileName, data, acl, function(err, file){
                if(err){
                  done(err);
                }else{
                  expect(file.fileName).to.be.eql(fileName);
                  done();
                }
              });
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          fs.readFile(filePath, function(err, data){
            if(err){
              done(err);
            }else{
              ncmb.File.upload(fileName, data, acl)
              .then(function(file){
                expect(file.fileName).to.be.eql(fileName);
                done();
              })
              .catch(function(err){
                done(err);
              });
            }
          });
        });
      });

      context("失敗した理由が", function(){
        context("fileName がないときに", function(){
          it("callback で取得時エラーを取得できる", function(done){
            ncmb.File.upload(null, filePath, function(err, file){
              if(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              }else{
                done(new Error("失敗すべき"));
              }
            });
          });
          it("promise で取得時エラーを取得できる", function(done){
            ncmb.File.upload(null, filePath)
            .then(function(file){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("fileData がないときに", function(){
          it("callback で取得時エラーを取得できる", function(done){
            ncmb.File.upload(fileName, null, function(err, file){
              if(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              }else{
                done(new Error("失敗すべき"));
              }
            });
          });
          it("promise で取得時エラーを取得できる", function(done){
            ncmb.File.upload(fileName, null)
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
  });

  describe("ファイル取得", function(){
    context("download", function(){
      context("fileNameを設定したときファイルの取得に成功し、", function(){
        it("callback でレスポンスを取得できる", function(done){
          ncmb.File.download("fetch_file.text", function(err, file){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          ncmb.File.download("fetch_file.text")
          .then(function(file){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("fileNameとresponseTypeを設定したときファイルの取得に成功し、", function(){
        it("callback でレスポンスを取得できる", function(done){
          ncmb.File.download("fetch_with_responsetype.text", "arraybuffer", function(err, file){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          ncmb.File.download("fetch_with_responsetype.text")
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
            ncmb.File.download(null, function(err, file){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise で取得時エラーを取得できる", function(done){
            ncmb.File.download()
            .then(function(file){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("fileName がstring型でないときに", function(){

          it("callback で取得時エラーを取得できる", function(done){
            ncmb.File.download(["fileName"], function(err, file){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise で取得時エラーを取得できる", function(done){
            ncmb.File.download(["fileName"])
            .then(function(file){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("responseType がstring型でないときに", function(){

          it("callback で取得時エラーを取得できる", function(done){
            ncmb.File.download("fetch_file.text", ["bufferarray"], function(err, file){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise で取得時エラーを取得できる", function(done){
            ncmb.File.download("fetch_file.text", ["bufferarray"])
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
  });

  describe("ファイルACL更新", function(){
    context("updateACL", function(){
      var fileName = null;
      var acl = null;
      beforeEach(function(){
        fileName = "update_file.text";
        acl = new ncmb.Acl();
        acl.setWriteAccess("abc", true);
      });

      it("callback でレスポンスを取得できる", function(done){
        ncmb.File.updateACL(fileName, acl, function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.File.updateACL(fileName, acl)
        .then(function(){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      var fileName = null;
      var acl = null;
      context("fileName がないときに", function(){
        beforeEach(function(){
          fileName = null;
          acl = new ncmb.Acl();
          acl.setWriteAccess("abc", true);
        });

        it("callback で更新時エラーを取得できる", function(done){
          ncmb.File.updateACL(fileName, acl, function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で更新時エラーを取得できる", function(done){
          ncmb.File.updateACL(fileName, acl)
          .then(function(){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      context("acl がないときに", function(){
        beforeEach(function(){
          fileName = "update_file.text";
          acl = null;
        });

        it("callback で更新時エラーを取得できる", function(done){
          ncmb.File.updateACL(fileName, acl, function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で更新時エラーを取得できる", function(done){
          ncmb.File.updateACL(fileName, acl)
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

  describe("ファイル削除", function(){
    context("delete", function(){
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
  describe("ファイル検索", function(){
    context("fetch", function(){
      context("成功した場合", function(){
        it("callback でレスポンスを取得できる", function(done){
          ncmb.File.fetchAll(function(err, file){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          ncmb.File.fetchAll()
          .then(function(file){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
  });
});
