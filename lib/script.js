"use strict";


var Errors = require("./errors");

/**
* Scriptの実行を扱うクラスです。
*
* メソッドは全て実行可能なインスタンスを生成し、状態を付与して返すファクトリメソッドです。
* メソッドチェインでヘッダ、ボディ、クエリを付与し、execメソッドで実行します。
*
* Script機能からのresponseは型が固定でないため、bodyキーにレスポンスを格納したObjectを返却します。
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

  Script.reservedHeaders = ["host", "X-NCMB-Application-Key", "X-NCMB-Signature", "X-NCMB-Timestamp", "Content-Type", "X-NCMB-SDK-Version"];

  var Executable = (function(){;
    function Executable(ncmb){
      this.__proto__.ncmb = ncmb;
    };
    /**
    * インスタンスに対してチェインしてリクエストヘッダを付与するメソッドです。
    *
    * @method set
    * @param  {Object} header リクエストヘッダを示すJSON形式のオブジェクト
    * @return {Script} this   引数のリクエストヘッダが付加された実行可能インスタンス
    */
    Executable.prototype.set = function(header){
      if(typeof header !== "object"){
        throw new Errors.InvalidRequestHeaderError("Script.set requires key-value Object in argument.");
      }
      Script.reservedHeaders.forEach(function(key){
        if(header[key]) throw new Errors.InvalidRequestHeaderError(key + " is reserved header.");
      });
      if(!this._header) this._header = {};
      Object.keys(header).forEach(function(key){
        this._header[key] = header[key];
      }.bind(this));
      return this;
    };

    /**
    * インスタンスに対してチェインしてリクエストボディを付与するメソッドです。
    *
    * @method data
    * @param  {Object} body リクエストボディを示すJSON形式のオブジェクト
    * @return {Script} this 引数のリクエストボディが付加された実行可能インスタンス
    */
    Executable.prototype.data = function(data){
      if(typeof data !== "object"){
        throw new Errors.InvalidRequestBodyError("Script.data requires key-value Object in argument.");
      }
      if(!this._data) this._data = {};
      Object.keys(data).forEach(function(key){
        this._data[key] = data[key];
      }.bind(this));
      return this;
    };

    /**
    * インスタンスに対してチェインしてクエリストリングを付与するメソッドです。
    *
    * @method query
    * @param  {Object} query クエリストリングを示すJSON形式のオブジェクト
    * @return {Script} this  引数のクエリストリングが付加された実行可能インスタンス
    */
    Executable.prototype.query = function(query){
      if(typeof query !== "object"){
        throw new Errors.InvalidRequestQueryError("Script.query requires key-value Object in argument.");
      }
      if(!this._query) this._query = {};
      Object.keys(query).forEach(function(key){
        this._query[key] = query[key];
      }.bind(this));
      return this;
    };

    /**
    * Scriptを実行するメソッドです。
    *
    * @method exec
    * @param  {string}  method      HTTPメソッド
    * @param  {string}  scriptName  スクリプトファイル名
    * @return {Object}  res         Scriptに定義されたレスポンスを内包するJSON形式のオブジェクト
    */
    Executable.prototype.exec = function(method, scriptName, callback){
      if(typeof method !== "string"){
        return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("Script.exec requires String HTTP method in first argument."));
      }

      switch (method.toUpperCase()) {
        case "GET":
        case "DELETE":
          if(this._data) return (callback || Promise.reject.bind(Promise))(new Errors.InvalidRequestBodyError(method + " could not have request body."));
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
        path: '/' + ncmb.scriptVersion + Script.className + '/' + scriptName,
        method: method,
        scriptName: scriptName,
        header: this._header,
        data: this._data,
        query: this._query
      })
      .then(function(body){
        // execメソッドが返す値がjsonであることを保証するため、bodyとしてレスポンスをjsonに包む
        var res = {"body": body}
        if(callback) return callback(null, res)
        return res;
      }).catch(function(err){
        if(callback) return callback(err, null);
        throw err;
      });
    };
    return Executable;
  })();

  Object.keys(Executable.prototype).forEach(function(methodName){
    Script[methodName] = function(){
      var executable = new Executable();
      return executable[methodName].apply(executable, [].slice.apply(arguments))
    }
  });

  ncmb.collections[className] = Script;
  return Script;
};