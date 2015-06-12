"use strict";

var Query = require("./query")
var Role = module.exports = function(ncmb){
  var reserved = [
    "save", "update", "delete", "className"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  }

  function Role(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }
      }
    }
    if(!this.roleName){
      throw new Error("roleName required")
    }
  }
  var className = Role.__proto__.className = Role.prototype.className = "/roles";

  Role.where     = function(where){    return new Query(ncmb, className).where(where);};
  Role.limit     = function(limit){    return new Query(ncmb, className).limit(limit);};
  Role.offset    = function(offset){   return new Query(ncmb, className).offset(offset);};
  Role.fetchAll  = function(callback){ return new Query(ncmb, className).fetchAll(callback);};
  Role.fetch     = function(callback){
    return new Query(ncmb, className).fetch(callback);};
  Role.fetchById = function(id, callback){
    return new Query(ncmb, className).fetchById(id, callback);};

  Role.prototype.save = function(callback){
    return ncmb.request({
      path: "/" + ncmb.version + className,
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
  Role.prototype.update = function(){};
  Role.prototype.delete = function(){};

  ncmb.collections[className] = Role;
  return Role;
};
