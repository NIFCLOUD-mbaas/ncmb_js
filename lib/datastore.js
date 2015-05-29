"use strict";

var Query = require("./query");
var Errors = require("./errors");

var DataStore = module.exports = (function(){
  function DataStore(name, options){
    var ncmb = this;
    var frameSize = 50;

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

      Data.saveAll = function(list, callback){
        if (list && (list.length < 1)) {
          return (callback || Promise.reject.bind(Promise))(new Errors.InvalidObjectsArrayError);
        }

        var frames = [], step = 0;
        var ignoreAttrs = ["objectId","createDate","updateDate"];
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
              path: ncmb.version + className,
              body: obj
            };
          }));
          if(step * frameSize > list.length) break;
        }

        return Promise.all(frames.map(function(frame){
          var reqData = {};
          reqData.requests = frame;
          return ncmb.request({
            path: "/" + ncmb.version + "/batch",
            method: "POST",
            data : reqData
          });
        })).then(function(results){
          var data = results.map(function(result){
            var _data = JSON.parse(result).map(function(_item){
              if(_item.success) {
                return _item.success;
              }
            });
            return _data;
          });
          for (var _i = 1; _i<data.length; _i++) {
            data[0] = data[0].concat(data[_i]);
          }
          if(callback) return callback(null, data[0]);
          return data[0];
        }).catch(function(err){
          if(callback) return callback(err, null);
          throw err;
        });
      };
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

      Data.prototype.update = function(){};
      Data.prototype.delete = function(){};

      ncmb.collections[className] = Data;
      return Data;
    })();
    return Data;
  };
  return DataStore;
})(this);
