"use strict";

var Query = require("./query")
var Role = module.exports = function(ncmb){
  var reserved = [
    "save", "update", "delete", "className"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  }

  function Role(){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }
      }
    }
  }
  var className = Role.__proto__.className = Role.prototype.className = "/roles";

  Role.where     = function(where){    return new Query(ncmb, className).where(where);};
  Role.limit     = function(limit){    return new Query(ncmb, className).limit(limit);};
  Role.offset    = function(offset){   return new Query(ncmb, className).offset(offset);};
  Role.fetchAll  = function(callback){ return new Query(ncmb, className).fetchAll(callback);};
  Role.fetch     = function(callback){
    return new Query(ncmb, name).fetch(callback);};
  Role.fetchById = function(id, callback){
    return new Query(ncmb, name).fetchById(id, callback);};

  Role.prototype.save = function(){};
  Role.prototype.update = function(){};
  Role.prototype.delete = function(){};

  ncmb.collections[className] = Role;
  return Role;
};
