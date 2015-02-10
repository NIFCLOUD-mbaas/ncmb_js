"use strict";

var Errors = require("./errors");

var modifiables = [
  "collections", "version", "fqdn", "port", "protocol", "proxy",
  "signatureMethod", "signatureVersion", "apikey", "clientkey"];

var NCMB = module.exports = (function(global){
  function NCMB (config){
    if(!config) config = {};
    this.collections      = config.collections || {};
    this.version          = config.version || "2013-09-01";
    this.fqdn             = config.fqdn || "mb.api.cloud.nifty.com";
    this.port             = config.port || 443;
    this.protocol         = config.protocol || "https:";
    this.signatureMethod  = config.signatureMethod || "HmacSHA256";
    this.signatureVersion = config.signatureVersion || 2;
    this.apikey           = config.apikey;
    this.clientkey        = config.clientkey;
  }

  NCMB.prototype.isModifiable = function(key){
    if(modifiables.indexOf(key) === -1) return false;
    return true;
  }

  /**
   * NCMB インスタンスに値を設定する
   *
   * @method set
   * @param key {String}
   * @param val {Object}
   * @return {Object} this
   */
  NCMB.prototype.set = function(key, val){
    if(!this.isModifiable(key))
      throw new Errors.UnmodifiableVariableError(key + " の変更はできません");
    this[key] = val;
    return this;
  };

  /**
   * NCMB インスタンスの値を取得する
   *
   * @method get
   * @param key {String}
   * @return {Object} key に対応する値
   */
  NCMB.prototype.get = function(key){
    return this[key];
  };

  /**
   * signature を作成する
   *
   * @method createSignature
   * @param url {String}
   * @param method {String}
   * @param query {String}
   * @param timestamp {String} [new Date().toISOString()]
   * @param signatureMethod {String} [this.signatureMethod]
   * @param signatureVersion {Number} [this.signatureVersion]
   * @param fqdn {String} [this.fqdn]
   * @param apikey {String} [this.apikey]
   * @param clientkey {String} [this.clientkey]
   * @return {String} signature
   */
  NCMB.prototype.createSignature = require("./signature").create;

  /**
   * request を実行する 低レベル API
   *
   * @method request
   * @param req {Object}
   * @param callback {Function}
   * @return promise {Promise}
   */
  NCMB.prototype.request = require("./request");

  NCMB.prototype.DataStore   = require("./datastore");
  NCMB.prototype.User        = require("./user");
  NCMB.prototype.Role        = require("./role");
  NCMB.prototype.File        = require("./file");
  NCMB.prototype.Push        = require("./push");
  NCMB.prototype.GeoLocation = require("./geo-location");

  return global.NCMB = NCMB;
})(this);
