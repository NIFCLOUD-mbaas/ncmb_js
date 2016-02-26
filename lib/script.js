"use strict";


var _ = require('lodash');
var Errors = require("./errors");

/**
* Scriptの実行を扱うクラスです。
*
* このクラスはすべてクラスメソッドでこうせいSあれており、インスタンスを生成せずに利用します。
*
* ファイルの返す値の型は保証されないため、すべてのメソッドは文字列で返却します。
*
* @class NCMB.Script
*/

var Script = module.exports = function(ncmb){
  var reserved = ["exec", "set", "data", "query"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };
  var unreplaceable = [
    "_id"
  ];

  var className = Script.className = "/script";
  var req = Script.req = {};

  /**
  * Scriptを実行するクラスメソッドです。
  *
  * @method exec
  * @param  {string}  HTTP method
  * @param  {string}  script name
  * @return {json}    response
  */
  Script.exec = function(method, scriptName, callback){
    var req = this.req;
    this.req = {};

    if(typeof method !== "string"){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("Script.exec requires String HTTP method in first argument."));
    }

    switch (method.toUpperCase()) {
      case "GET":
      case "DELETE":
        if(req.data) return (callback || Promise.reject.bind(Promise))(new Errors.InvalidRequestBodyError(method + " could not have request body."));
        break;
      case "POST":
      case "PUT":
        break;
      default:
        return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("Script.exec requires String HTTP method in first argument."));
    }

    if(typeof scriptName !== "string"){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("Script name must be string."));
    }

    return ncmb.requestScript({
      path: '/' + ncmb.scriptVersion + this.className + '/' + scriptName,
      method: method,
      scriptName: scriptName,
      header: req.header,
      data: req.data,
      query: req.query
    })
    .then(function(body){
      // SDKが返す値をjsonであることを保証するため、bodyとしてjsonに包む
      var res = {"body": body}
      if(callback) return callback(null, res)
      return res;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * Scriptに対してチェインしてリクエストヘッダを付与するメソッドです。
  *
  * @method set
  * @param  {Object}  リクエストヘッダを示すJSON形式のオブジェクト
  * @return {Script}  this
  */
  Script.set = function(header){
    if(typeof header !== "object") throw new Errors.InvalidRequestHeaderError("Script.set requires key-value Object in argument.");
    this.req.header = _.merge({}, this.req.data, header);
    return this;
  }

  /**
  * Scriptに対してチェインしてリクエストボディを付与するメソッドです。
  *
  * @method data
  * @param  {Object}  リクエストボディを示すJSON形式のオブジェクト
  * @return {Script}  this
  */
  Script.data = function(data){
    if(typeof data !== "object") throw new Errors.InvalidRequestBodyError("Script.data requires key-value Object in argument.");
    this.req.data = _.merge({}, this.req.data, data);
    return this;
  }

  /**
  * Scriptに対してチェインしてクエリストリングを付与するメソッドです。
  *
  * @method query
  * @param  {Object}  クエリストリングを示すJSON形式のオブジェクト
  * @return {Script}  this
  */
  Script.query = function(query){
    if(typeof query !== "object") throw new Errors.InvalidRequestQueryError("Script.query requires key-value Object in argument.");
    this.req.query = _.merge({}, this.req.query, query);
    return this;
  }

  ncmb.collections[className] = Script;
  return Script;
};