"use strict";

var Promise = require("bluebird");
var Query = require("./query")
var DataStore = module.exports = (function(){
  function DataStore(name, options){
    var ncmb = this;
    var Data = (function(){
      function Data(attrs){
        for(var attr in attrs){
          if(attrs.hasOwnProperty(attr)){
            this[attr] = attrs[attr];
          }
        }
      }
      Data.__proto__.className = name;

      Data.where     = function(where){    return new Query(ncmb, name).where(where);};
      Data.limit     = function(limit){    return new Query(ncmb, name).limit(limit);};
      Data.offset    = function(offset){   return new Query(ncmb, name).offset(offset);};
      Data.fetchAll  = function(callback){
        return new Query(ncmb, name).fetchAll()
          .then(function(res){
            // parse JSON should be moved to request.js
            try{
              var results = JSON.parse(res).results;
            }catch(err){
              throw err;
            }
            var objs = results.map(function(data){
              return new Data(data);
            });
            if(callback) return callback(null, res, objs);
            return objs;
          })
          .catch(function(err){
            if(callback) return callback(err, null, null);
            throw err;
          });
      };
      // Data.fetch     = function(callback){ return new Query(ncmb, name).fetch(callback);};
      // Data.fetchById = function(callback){ return new Query(ncmb, name).fetch(callback);};

      Data.prototype.className = name;
      Data.prototype.options = options;

      /**
       * save これを実装する
       *
       * @method save
       *
       */
      Data.prototype.save = function(callback){
        return ncmb.request({
          path: "/" + ncmb.version + "/classes/" + this.className,
          method: "POST",
          data: this
        }, callback);
      };
      return Data;
    })();
    return Data;
  };
  return DataStore;
})(this);
