"use strict";

var Errors = require("./errors");

var File = module.exports = function(ncmb){
  var reserved = [ "upload", "getfile", "delete"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  }

  function File(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }
      }
    }
  }
  var className = File.__proto__.className = File.prototype.className = "/files";

  File.prototype.upload = function(callback){};
  File.fetch = function(fileName, callback){
    if(! fileName){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoFileNameError());
    };
    return ncmb.request({
      path: "/" + ncmb.version + this.className + "/" + fileName,
      method: "GET"
    }).then(function(data){
      if(callback) return callback(null,data);
      return data;
    }.bind(this)).catch(function(err){
      if (callback) return callback(err, null);
      throw err;
    });
  };

  File.prototype.delete = function(callback){
    if(!this.fileName){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoFileNameError());
    };
    return ncmb.request({
      path: "/" + ncmb.version + this.className + "/" + this.fileName,
      method: "DEL"
    }).then(function(){
      if(callback) return callback(null);
      return;
    }).catch(function(err){
      if (callback) return callback(err, null);
      throw err;
    });
  };

  ncmb.collections[className] = File;
  return File;
};
