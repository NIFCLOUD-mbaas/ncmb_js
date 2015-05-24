"use strict";

var Query = require("./query");
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
        //slice to array
        var arySave = [];
        if (list) {
          var i = 0;
          while (i*50<list.length) {
              arySave[i] = list.slice(i*50 , i*50+49);
              i++;
          }
        }
        function _createSaveAllRequestStr(list){
          var _i;
          var _requestString = "[";
          var _dataToSave = {};
          for (_i = 0; _i < list.length; _i++) {
            var _object = list[_i];
            Object.keys(_object).forEach(function (_key) {
              var _unsaveList = ["objectId","createDate","updateDate"];
              if (_unsaveList.indexOf(_key) == -1) {
                _dataToSave[_key] = _object[_key];
              } 
            });
            _requestString = _requestString + '{"method":"POST", ';
            _requestString = _requestString + '"path":' + ncmb.version                + className + '", ';
            _requestString = _requestString + '"body":' + JSON.stringify(_dataToSave) + '}';
            if (_i < (list.length - 1)) {
              _requestString += ','; 
            }
          }
          _requestString += "]";
          return _requestString;
        }
        function _batchSaveRequest(requestString) {
          return ncmb.request({
            path: "/" + ncmb.version + "batch",
            method: "POST",
            data: requestString
          });
        }
        //create array of Promise
        var aryPromise = [];
        for (var _i = 0; _i < arySave.length; _i++) {
           aryPromise[_i] = _batchSaveRequest(_createSaveAllRequestStr(arySave[_i]));
        }
        return Promise.all(aryPromise)
        .then(function(data){
          try{
            var obj = JSON.parse(data);
          }catch(err){
            throw err;
          }
          if(callback) return callback(null, this);
          return this;
        }.bind(this))
        .catch(function(err){
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
