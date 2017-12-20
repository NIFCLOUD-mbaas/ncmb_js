"use strict";

var config = require("config");
var expect = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("レスポンスエラー確認", function() {

    describe("ID/PWユーザーでログイン", function() {
        var ncmb = null;
        before(function() {
            ncmb = new NCMB(config.apikey, config.clientkey);
            if (config.apiserver) {
                ncmb
                    .set("protocol", config.apiserver.protocol)
                    .set("fqdn", config.apiserver.fqdn)
                    .set("port", config.apiserver.port)
                    .set("proxy", config.apiserver.proxy || "")
                    .set("stub", config.apiserver.stub);
            }
        });

        var user = null;
        var userName = null;
        var password = null;
        context("プロバティにuserName, passwordが間違ってログインに失敗して", function() {
            beforeEach(function() {
                userName = "wronguser"
                password = "wrongpassword";
                user = new ncmb.User({
                    userName: userName,
                    password: password
                });
            });

            it("callback でレスポンスのエラーを確認できる", function(done) {
                ncmb.User.login(user, function(err, data) {
                    if (!err) {
                        done(new Error("失敗すべき"));
                    } else {
                        expect(err.error).to.equal('Authentication error with ID/PASS incorrect.');
                        done();
                    }
                });
            });

            it("promise でレスポンスのエラーを確認できる", function(done) {
                ncmb.User.login(user)
                    .then(function(data) {
                        done(new Error("失敗すべき"));
                    })
                    .catch(function(err) {
                        expect(err.error).to.equal('Authentication error with ID/PASS incorrect.');
                        done();
                    });
            });
        });
    });


    describe("パラメータ設定", function() {
        var ncmb = null;
        before(function() {
            ncmb = new NCMB("wrongAPIKEY", "wrongCLIENTKEY");
        });

        context("設定可能でないキーの場合は失敗する", function() {
            var TestClassError = null;
            var testClassError = null;
            beforeEach(function() {
                TestClassError = ncmb.DataStore("WrongAppKeyAndClientKey");
                testClassError = new TestClassError({
                    key: "value"
                });
            });
            it("callback でレスポンスのエラーを確認できる", function(done) {
                testClassError.save(function(err, obj) {
                    if (err) {
                        expect(err.error).to.equal('No such application.');
                        done();
                    } else {
                        done(new Error("失敗すべき"));
                    }
                });
            });
            it("promise でレスポンスのエラーを確認できる", function(done) {
                testClassError.save()
                    .then(function(obj) {
                        done(new Error("失敗すべき"));
                    })
                    .catch(function(err) {
                        expect(err.error).to.equal('No such application.');
                        done();
                    });
            });
        });
    });
});