"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

(typeof window !== "undefined" ? describe.skip : describe)("NCMB Script", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey);
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("scriptFqdn", config.apiserver.scriptFqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
     }
  });

  describe("文字列を返すScriptを実行し", function(){
    context("GETメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetText.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.text;
              expect(res.body).to.be.equal('get_text');
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetText.js')
          .then(function(res){
            expect(res.body).to.be.text;
            expect(res.body).to.be.equal('get_text');
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("POSTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostText.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.text;
              expect(res.body).to.be.equal('post_text');
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostText.js')
          .then(function(res){
            expect(res.body).to.be.text;
            expect(res.body).to.be.equal('post_text');
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("PUTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutText.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.text;
              expect(res.body).to.be.equal('put_text');
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutText.js')
          .then(function(res){
            expect(res.body).to.be.text;
            expect(res.body).to.be.equal('put_text');
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("DELETEメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('DELETE', 'execDeleteText.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.text;
              expect(res.body).to.be.equal('delete_text');
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('DELETE', 'execDeleteText.js')
          .then(function(res){
            expect(res.body).to.be.text;
            expect(res.body).to.be.equal('delete_text');
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
  });

  describe("jsonを返すScriptを実行し", function(){
    context("GETメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetJson.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.json;
              expect(JSON.parse(res.body).key).to.be.equal("get_json");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetJson.js')
          .then(function(res){
            expect(res.body).to.be.json;
            expect(JSON.parse(res.body).key).to.be.equal("get_json");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("POSTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostJson.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.json;
              expect(JSON.parse(res.body).key).to.be.equal("post_json");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostJson.js')
          .then(function(res){
            expect(res.body).to.be.json;
            expect(JSON.parse(res.body).key).to.be.equal("post_json");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("PUTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutJson.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.json;
              expect(JSON.parse(res.body).key).to.be.equal("put_json");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutJson.js')
          .then(function(res){
            expect(res.body).to.be.json;
            expect(JSON.parse(res.body).key).to.be.equal("put_json");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("DELETEメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('DELETE', 'execDeleteJson.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.json;
              expect(JSON.parse(res.body).key).to.be.equal("delete_json");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('DELETE', 'execDeleteJson.js')
          .then(function(res){
            expect(res.body).to.be.json;
            expect(JSON.parse(res.body).key).to.be.equal("delete_json");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
  });

  describe("headerを必要とするScriptを実行し", function(){
    context("headerを付与してGETメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('GET', 'execGetWithHeader.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("get_with_header");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('GET', 'execGetWithHeader.js')
          .then(function(res){
            expect(res.body).to.be.equal("get_with_header");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("headerを付与してPOSTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('POST', 'execPostWithHeader.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("post_with_header");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('POST', 'execPostWithHeader.js')
          .then(function(res){
            expect(res.body).to.be.equal("post_with_header");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("headerを付与してPUTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('PUT', 'execPutWithHeader.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("put_with_header");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('PUT', 'execPutWithHeader.js')
          .then(function(res){
            expect(res.body).to.be.equal("put_with_header");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("headerを付与してDELETEメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('DELETE', 'execDeleteWithHeader.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("delete_with_header");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .set({testHeader: "testHeaderValue"})
          .exec('DELETE', 'execDeleteWithHeader.js')
          .then(function(res){
            expect(res.body).to.be.equal("delete_with_header");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("Script.setメソッドにObject型以外を渡し", function(done){
      it("InvalidRequestHeaderErrorが返される", function(done){
        try{
          ncmb.Script.set('{testHeader: "testHeaderValue"}')
          done(new Error("error が返されなければならない"));
        }catch(err){
          expect(err.name).to.be.equal("InvalidRequestHeaderError");
          done();
        }
      });
    });
  });

  describe("bodyを必要とするScriptを実行し", function(){
    context("bodyを付与してGETメソッドで実行し InvalidRequestBodyErrorが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('GET', 'execGetWithData.js', function(err, res){
            if(err){
              expect(err.name).to.be.equal("InvalidRequestBodyError");
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('GET', 'execGetWithData.js')
          .then(function(){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.name).to.be.equal("InvalidRequestBodyError");
            done();
          });
      });
    });
    context("bodyを付与してPOSTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('POST', 'execPostWithData.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("post_with_data");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('POST', 'execPostWithData.js')
          .then(function(res){
            expect(res.body).to.be.equal("post_with_data");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("bodyを付与してPUTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('PUT', 'execPutWithData.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("put_with_data");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('PUT', 'execPutWithData.js')
          .then(function(res){
            expect(res.body).to.be.equal("put_with_data");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("bodyを付与してDELETEメソッドで実行し InvalidRequestBodyErrorが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('DELETE', 'execDeleteWithData.js', function(err, res){
            if(err){
              expect(err.name).to.be.equal("InvalidRequestBodyError");
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .data({testData: "testDataValue"})
          .exec('DELETE', 'execDeleteWithData.js')
          .then(function(){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.name).to.be.equal("InvalidRequestBodyError");
            done();
          });
      });
    });
    context("Script.dataメソッドにObject型以外を渡し", function(done){
      it("InvalidRequestBodyErrorが返される", function(done){
        try{
          ncmb.Script.data('{testData: "testDataValue"}')
          done(new Error("error が返されなければならない"));
        }catch(err){
          expect(err.name).to.be.equal("InvalidRequestBodyError");
          done();
        }
      });
    });
  });

  describe("queryを必要とするScriptを実行し", function(){
    context("queryを付与してGETメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('GET', 'execGetWithQuery.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("get_with_query");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('GET', 'execGetWithQuery.js')
          .then(function(res){
            expect(res.body).to.be.equal("get_with_query");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("queryを付与してPOSTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('POST', 'execPostWithQuery.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("post_with_query");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('POST', 'execPostWithQuery.js')
          .then(function(res){
            expect(res.body).to.be.equal("post_with_query");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("queryを付与してPUTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('PUT', 'execPutWithQuery.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("put_with_query");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('PUT', 'execPutWithQuery.js')
          .then(function(res){
            expect(res.body).to.be.equal("put_with_query");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("queryを付与してDELETEメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('DELETE', 'execDeleteWithQuery.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("delete_with_query");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .query({testQuery: "testQueryValue"})
          .exec('DELETE', 'execDeleteWithQuery.js')
          .then(function(res){
            expect(res.body).to.be.equal("delete_with_query");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("Script.queryメソッドにObject型以外を渡し", function(done){
      it("InvalidRequestQueryErrorが返される", function(done){
        try{
          ncmb.Script.query('{testQuery: "testQueryValue"}')
          done(new Error("error が返されなければならない"));
        }catch(err){
          expect(err.name).to.be.equal("InvalidRequestQueryError");
          done();
        }
      });
    });
  });

  describe("header, body, queryを必要とするScriptを実行し", function(){
    context("メソッドを複数チェインしてPOSTメソッドで実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .set({testHeader_1: "testHeaderValue_1"})
          .data({testData_1: "testDataValue_1"})
          .query({testQuery_1: "testQueryValue_1"})
          .set({testHeader_2: "testHeaderValue_2"})
          .data({testData_2: "testDataValue_2"})
          .query({testQuery_2: "testQueryValue_2"})
          .exec('POST', 'execMethodChain.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal("method_chain");
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .set({testHeader_1: "testHeaderValue_1"})
          .data({testData_1: "testDataValue_1"})
          .query({testQuery_1: "testQueryValue_1"})
          .set({testHeader_2: "testHeaderValue_2"})
          .data({testData_2: "testDataValue_2"})
          .query({testQuery_2: "testQueryValue_2"})
          .exec('POST', 'execMethodChain.js')
          .then(function(res){
            expect(res.body).to.be.equal("method_chain");
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
  });

  describe("内部エラーを返すScriptを実行し", function(){
    context("GETメソッドで実行し 500エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetInternalError.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(500);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetInternalError.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(500);
            done();
          });
      });
    });
    context("POSTメソッドで実行し 500エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostInternalError.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(500);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostInternalError.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(500);
            done();
          });
      });
    });
    context("PUTメソッドで実行し 500エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutInternalError.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(500);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutInternalError.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(500);
            done();
          });
      });
    });
    context("DELETEメソッドで実行し 500エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('DELETE', 'execDeleteInternalError.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(500);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('DELETE', 'execDeleteInternalError.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(500);
            done();
          });
      });
    });
  });

  describe("存在しないScriptを実行し", function(){
    context("GETメソッドで実行し 404エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetNotFound.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(404);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('GET', 'execGetNotFound.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(404);
            done();
          });
      });
    });
    context("POSTメソッドで実行し 404エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostNotFound.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(404);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execPostNotFound.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(404);
            done();
          });
      });
    });
    context("PUTメソッドで実行し 404エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutNotFound.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(404);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('PUT', 'execPutNotFound.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(404);
            done();
          });
      });
    });
    context("DELETEメソッドで実行し 404エラーが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execDeleteNotFound.js', function(err, res){
            if(err){
              expect(err.status).to.be.equal(404);
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('POST', 'execDeleteNotFound.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.status).to.be.equal(404);
            done();
          });
      });
    });
  });

  // バリデーション
  describe("引数を渡してScript.execを実行:", function(){
    context("第一引数にHTTPメソッド以外の文字列型を渡し InvalidArgumentErrorが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('InvalidMethod', 'InvalidArgument.js', function(err, res){
            if(err){
              expect(err.name).to.be.equal("InvalidArgumentError");
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('InvalidMethod', 'InvalidArgument.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.name).to.be.equal("InvalidArgumentError");
            done();
          });
      });
    });
    context("第一引数に文字列型以外を渡し InvalidArgumentErrorが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec(1, 'InvalidArgument.js', function(err, res){
            if(err){
              expect(err.name).to.be.equal("InvalidArgumentError");
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec(1, 'InvalidArgument.js')
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.name).to.be.equal("InvalidArgumentError");
            done();
          });
      });
    });
    context("第一引数に小文字でHTTPメソッドを渡し 実行に成功し", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('get', 'execGetWithLowerCase.js', function(err, res){
            if(err){
              done(err);
            }else{
              expect(res.body).to.be.equal('get_with_lower_case');
              done();
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('get', 'execGetWithLowerCase.js')
          .then(function(res){
            expect(res.body).to.be.equal('get_with_lower_case');
            done();
          })
          .catch(function(err){
            done(err);
          });
      });
    });
    context("第二引数に文字列型以外の値を渡し InvalidArgumentErrorが返され", function(done){
      it("callbackで取得できる", function(done){
        ncmb.Script
          .exec('GET', 1, function(err, res){
            if(err){
              expect(err.name).to.be.equal("InvalidArgumentError");
              done();
            }else{
              done(new Error("error が返されなければならない"));
            }
        });
      });
      it("promiseで取得できる", function(done){
        ncmb.Script
          .exec('GET', 1)
          .then(function(res){
            done(new Error("error が返されなければならない"));
          })
          .catch(function(err){
            expect(err.name).to.be.equal("InvalidArgumentError");
            done();
          });
      });
    });
  });
});
