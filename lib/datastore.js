"use strict";

var Query        = require("./query");
var Operation    = require("./operation");
var Errors       = require("./errors");
var _            = require("lodash");
var objectAssign = require('object-assign');

var DataStore = module.exports = (function(){
  function DataStore(name, options){
    if(!name) throw new Error("class name required");
    var ncmb = this;
    var frameSize = 50;

    var reserved = [
      "batch", "save", "update", "delete", "className"];
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
        if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
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

      Data.batch = function(list, callback){
        list = Array.isArray(list) ? list : [list];
        if (list.length < 1) {
          return (callback || Promise.reject.bind(Promise))(new Errors.EmptyArrayError("Empty Array is inputed."));
        }

        var frames = [], step = 0;
        var ignoreAttrs = ["objectId", "createDate", "updateDate"];
        for(;;){
          frames.push(list.slice(step++ * frameSize, step * frameSize).map(function(item){
            var obj = {};
            Object.keys(item).forEach(function(key){
              if(ignoreAttrs.indexOf(key) === -1){
                obj[key] = item[key];
              }
            });
            return {
              method: "POST",
              path:   ncmb.version + className,
              body:   obj
            };
          }));
          if(step * frameSize > list.length) break;
        }

        return Promise.all(frames.map(function(frame){
          return ncmb.request({
            path:   "/" + ncmb.version + "/batch",
            method: "POST",
            data:   { requests: frame }
          });
        })).then(function(results){
          var data = _.flatten(results.map(function(result){
            try{
              return JSON.parse(result).map(function(item){
                return new Data(item.success);
              }).filter(function(r){ return r;});
            }catch(err){
              return null;
            }
          })).filter(function(r){ return r;});
          if(callback) return callback(null, data);
          return data;
        }).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };

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

      Data.prototype.update = function(callback){
        if(!this.objectId) {
          return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Updated object must be saved before."));
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
          try{
            var obj = JSON.parse(data);
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

      Data.prototype.delete = function(callback){
        if(!this.objectId){
          return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Deleted object must be saved before."));
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
