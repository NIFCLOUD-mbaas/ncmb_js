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
  Role.prototype.update = function(callback){
    if(!this.objectId) {
      return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError());
    }
    var dataToSave = {};
    Object.keys(this).forEach(function (key) {
      if (["objectId", "createDate", "updateDate"].indexOf(key) == -1) {
        dataToSave[key] = this[key];
      }
    }.bind(this));
    return ncmb.request({
      path:   "/" + ncmb.version + className + "/" + this.objectId,
      method: "PUT",
      data:   dataToSave
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      this.updateDate = obj.updateDate;
      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  Role.prototype.delete = function(){};

  ncmb.collections[className] = Role;
  return Role;
};
