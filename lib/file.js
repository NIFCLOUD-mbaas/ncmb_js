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
  var className = User.__proto__.className = User.prototype.className = "/files";

  File.prototype.upload = function(callback){};
  File.prototype.getfile = function(callback){};
  File.prototype.delete = function(callback){};

  ncmb.collections[className] = File;
  return File;
};
