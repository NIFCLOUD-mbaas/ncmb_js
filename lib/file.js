"use strict";

var Errors = require("./errors");
var Query = require("./query");

/**
* ファイルストアを扱うクラスです。
* このクラスはすべてクラスメソッドで構成されており、インスタンスを生成せずに利用します。
*
* @class ncmb.File
* @constructor
*/
var File = module.exports = function(ncmb){
  var className = File.className = "/files";

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      File[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });

  File.prototype.upload = function(callback){};
  File.download = function(fileName, callback){
    if(typeof fileName !== "string"){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("File name must be string."));
    };
    return ncmb.request({
      path: "/" + ncmb.version + className + "/" + fileName,
      method: "GET"
    }).then(function(data){
      if(callback) return callback(null, data);
      return data;
    }.bind(this)).catch(function(err){
      if (callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 指定したファイルのACL情報を更新します。
  *
  * @method ncmb.File.updateACL
  * @param {String} fileName 更新するファイル名
  * @param {ncmb.ACL} acl 更新後のacl情報を設定したncmb.ACLインスタンス
  * @param {Function} callback コールバック関数
  * @return {String} data APIレスポンスのJSON文字列を返却
  */
  File.updateACL = function(fileName, acl, callback){
    if(typeof fileName !== "string"){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("File name must be string."));
    };
    if(!acl){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoACLError("Acl is required."));
    };
    return ncmb.request({
      path: "/" + ncmb.version + className + "/" + fileName,
      method: "PUT",
      data: {acl:acl}
    }).then(function(data){
       try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }

      if(callback) return callback(null, obj);
      return obj;
    }.bind(this)).catch(function(err){
      if (callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 指定したファイルを削除します。
  *
  * @method ncmb.File.delete
  * @param {String} fileName 削除するファイル名
  * @param {Function} callback コールバック関数
  */
  File.delete = function(fileName, callback){
    if(typeof fileName !== "string"){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("File name must be string."));
    };
    return ncmb.request({
      path: "/" + ncmb.version + className + "/" + fileName,
      method: "DEL"
    }).then(function(){
      if(callback) return callback(null);
      return;
    }).catch(function(err){
      if (callback) return callback(err);
      throw err;
    });
  };

  ncmb.collections[className] = File;
  return File;
};
