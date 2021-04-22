"use strict";

var Query        = require("./query");
var Operation    = require("./operation");
var Errors       = require("./errors");
var flatten      = require("lodash.flatten");
var objectAssign = require('object-assign');

/**
* データストアへの入出力について扱うクラスです。
* 
* @class NCMB.DataStore
* @extends {Operation}
* @param {string} name mobile backend にインスタンスを保存するクラス名。
*/
var DataStore = module.exports = (function(){
  function DataStore(name){
    if(!name) throw new Error("class name required");
    var ncmb = this;
    var frameSize = 50;

    var reserved = [
      "save", "update", "delete", "className"];
    var isReserved = function(key){
      return reserved.indexOf(key) > -1;
    };

    var unreplaceable =[
      "objectId", "createDate", "updateDate", "_id"
    ];

    var isReplaceable = function(key){
      if(unreplaceable.indexOf(key) === -1) return true;
      return false;
    };

    var Data = (function(){
      function Data(attrs){
        for(var attr in attrs){
          if(attrs.hasOwnProperty(attr)){
            if(!isReserved(attr)){
              if(attrs[attr] instanceof ncmb.Acl) {
                this[attr] = attrs[attr].toJSON();
                continue;
              }
              this[attr] = attrs[attr];
            }
          }
        }
      }
      var className = Data.prototype.className = "/classes/" + name;
      Object.keys(Query.prototype).forEach(function(attr){
        if(typeof Query.prototype[attr] === "function"){
          Data[attr] = function(){
            var query = new Query(ncmb, className);
            return query[attr].apply(query, [].slice.apply(arguments));
          };
        }
      });
      Object.keys(Operation.prototype).forEach(function(attr){
        if(typeof Operation.prototype[attr] === "function"){
          Data.prototype[attr] = function(){
            var operation = new Operation(reserved);
            return operation[attr].apply(this, [].slice.apply(arguments));
          };
        }
      });

      /**
      * オブジェクトを保存します。
      *
      * @method NCMB.DataStore#save
      * @param {function} callback? コールバック関数
      * @return {Promise<this>}
      */
      Data.prototype.save = function(callback){
        return ncmb.request({
          path: "/" + ncmb.version + this.className,
          method: "POST",
          data: this
        }).then(function(data){
          var obj = null;
          try{
            obj = JSON.parse(data);
          }catch(err){
            throw err;
          }
          objectAssign(this, obj);
          Object.keys(this).forEach(function (key) {
            if(this[key] && this[key].__op) delete this[key];
          }.bind(this));

          if(callback) return callback(null, this);
          return this;
        }.bind(this)).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };

      /**
      * オブジェクトを更新します。
      *
      * @method NCMB.DataStore#update
      * @param {function} callback? コールバック関数
      * @return {Promise<this>}
      */
      Data.prototype.update = function(callback){
        if(!this.objectId) {
          return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Save the object before updating"));
        }
        var dataToUpdate = {};
        Object.keys(this).forEach(function (key) {
          if(!isReplaceable(key)) return;
          dataToUpdate[key] = this[key];
        }.bind(this));

        return ncmb.request({
          path: "/" + ncmb.version + this.className + "/" + this.objectId,
          method: "PUT",
          data: dataToUpdate
        }).then(function(data){
          var obj = null;
          try{
            obj = JSON.parse(data);
          }catch(err){
            throw err;
          }
          this.updateDate = obj.updateDate;
          Object.keys(this).forEach(function (key) {
            if(this[key] && this[key].__op) delete this[key];
          }.bind(this));

          if(callback) return callback(null, this);
          return this;
        }.bind(this)).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };

      /**
      * オブジェクトを削除します。
      *
      * @method NCMB.DataStore#delete
      * @param {function} callback? コールバック関数
      * @return {Promise<void>}
      */
      Data.prototype.delete = function(callback){
        if(!this.objectId){
          return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Save the object before deleting"));
        }
        return ncmb.request({
          path: "/" + ncmb.version + this.className + "/" + this.objectId,
          method: "DEL"
        }).then(function(){
          if(callback) return callback(null, true);
          return true;
        }).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };

      ncmb.collections[className] = Data;
      return Data;
    })();
    return Data;
  };
  return DataStore;
})(this);

/**
 * @interface NCMB.DataStoreConstructor
 * @extends Query<DataStore>
 */

/**
 * @method
 * @name NCMB.DataStoreConstructor#new
 * @param {object} [attrs]
 * @return {NCMB.DataStore}
 */