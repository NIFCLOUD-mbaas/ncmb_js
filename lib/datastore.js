"use strict";

var Query = require("./query");
var Error = require("./errors");
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
        if(!this.objectId) throw Error.NoObjectidError;
        var _objectId = this.objectId;
        
        //do not include objectId, createDate, updateDate in update data
        delete this.objectId;
        delete this.updateDate;
        delete this.createDate;

        return ncmb.request({
          path: "/" + ncmb.version + this.className + "/" + _objectId,
          method: "PUT",
          data: this
        }).then(function(data){
          try{
            var obj = JSON.parse(data);
          }catch(err){
            throw err;
          }

          //set objectId
          this.objectId = _objectId;
          this.updateDate = obj.updateDate;

          if(callback) return callback(null, this);
          return this;
        }.bind(this)).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };

      Data.prototype.delete = function(){};
      Data.prototype.fetch = function(callback){
        //return error when objectId is null
        if(!this.objectId) throw Error.NoObjectidError;
        return ncmb.request({
          path: "/" + ncmb.version + this.className + "/" + this.objectId,
          method: "GET",
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

      Data.prototype.fetchById = function(objectId, callback){
        if(!objectId) throw Error.NoObjectidError;
        this.objectId = objectId;
        return this.fetch(callback);
      };

      ncmb.collections[className] = Data;
      return Data;
    })();
    return Data;
  };
  return DataStore;
})(this);
