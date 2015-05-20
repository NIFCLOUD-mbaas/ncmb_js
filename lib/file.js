"use strict";

var fs = require('fs');
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
  File.prototype.getfile = function(callback){};
  File.prototype.delete = function(callback){
    if(!this.fileName){
      var err = new Errors.NoFileNameError();
      return callback ? callback(err) : Promise.reject(err);
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
