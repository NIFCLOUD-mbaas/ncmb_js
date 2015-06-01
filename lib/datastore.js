"use strict";

var Query  = require("./query");
var Errors = require("./errors");

var DataStore = module.exports = (function(){
  function DataStore(name, options){
    var ncmb = this;

    var reserved = [
      "save", "update", "delete", "className"];
    var isReserved = function(key){
      return reserved.indexOf(key) > -1;
    }

    var Data = (function(){

      function Data(attrs){
        for(var attr in attrs){
          if(attrs.hasOwnProperty(attr)){
            if(!isReserved(attr)){
              if(attrs[attr] instanceof ncmb.Acl) {
                this[attr] = attrs[attr].toJSON();
                continue;
              }
              if(attrs[attr] instanceof ncmb.Geolocation) {
                this[attr] = attrs[attr].toJSON();
                continue;
              }
              if (attrs[attr] instanceof Date) {
                this[attr] = {
                  "__type" : "Date",
                  "iso" : attrs[attr].toJSON()
                };
                continue;
              }
              this[attr] = attrs[attr];
            }
          }
        }
      }
      var className = Data.__proto__.className = "/classes/" + name;

      Data.where     = function(where){
        return new Query(ncmb, className).where(where);};
      Data.limit     = function(limit){
        return new Query(ncmb, className).limit(limit);};
      Data.offset    = function(offset){
        return new Query(ncmb, className).offset(offset);};
      Data.fetchAll  = function(callback){
        return new Query(ncmb, className).fetchAll(callback);};
      Data.fetch     = function(callback){
        return new Query(ncmb, className).fetch(callback);};
      Data.fetchById = function(id, callback){
        return new Query(ncmb, className).fetchById(id, callback);};

      Data.prototype.className = className;

      Data.prototype.save = function(callback){
        return ncmb.request({
          path: "/" + ncmb.version + this.className,
          method: "POST",
          data: this
        }).then(function(data){
          try{
            var obj = JSON.parse(data);
          }catch(err){
            throw err;
          }
          this.objectId = obj.objectId;
          this.createDate = obj.createDate;

          if(callback) return callback(null, this);
          return this;
        }.bind(this)).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };

      Data.prototype.update = function(callback){
        //return error when objectId is null
        if(!this.objectId) {
          return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError());
        }

        var _dataToSave = {};
        Object.keys(this).forEach(function (_key) {
          if (["objectId","createDate","updateDate"].indexOf(_key) == -1) {
            _dataToSave[_key] = this[_key];
          }
        }.bind(this));

        return ncmb.request({
          path: "/" + ncmb.version + this.className + "/" + this.objectId,
          method: "PUT",
          data: _dataToSave
        }).then(function(data){
          try{
            var obj = JSON.parse(data);
          }catch(err){
            throw err;
          }

          this.updateDate = obj.updateDate;
          if(callback) return callback(null, this);
          return this;
        }.bind(this)).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };

      Data.prototype.delete = function(callback){
        if(!this.objectId){
          var err = new Errors.NoObjectIdError();
          return callback ? callback(err) : Promise.reject(err);
        }
        return ncmb.request({
          path: "/" + ncmb.version + this.className + "/" + this.objectId,
          method: "DEL"
        }).then(function(){
          if(callback) return callback(null);
          return;
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
