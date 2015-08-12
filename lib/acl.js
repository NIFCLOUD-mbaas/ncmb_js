"use strict";

var errors = require("./errors");
var Acl = module.exports = function(ncmb) {
  var reserved = [
    "set", "setReadAccess", "setWriteAccess",
    "setPublicReadAccess", "setPublicWriteAccess",
    "setUserReadAccess", "setUserWriteAccess",
    "setRoleReadAccess", "setRoleWriteAccess",
    "toJSON"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  }

  function Acl(permissions) {
    if(permissions) {
      Object.keys(permissions).forEach(function(key){
        if(isReserved(key)){
          throw new errors.UnReplaceableKeyError();
        }
        if(permissions[key] && (permissions[key].read || permissions[key].write)){
          this[key] = permissions[key];
        }else{
          throw new errors.InvalidArgumentError();
        }
      }.bind(this));
    }
  };

  Acl.prototype.set = function(target, type, allowed) {
    if(isReserved(target)){
      throw new errors.UnReplaceableKeyError();
    }
    this[target] = this[target] || {};
    this[target][type] = allowed;
    return this;
  };
  Acl.prototype.setReadAccess = function(target, allowed) {
    return this.set(target, "read", allowed);
  };
  Acl.prototype.setWriteAccess = function(target, allowed) {
    return this.set(target, "write", allowed);
  };
  Acl.prototype.setPublicReadAccess = function(allowed) {
    return this.setReadAccess("*", allowed);
  };
  Acl.prototype.setPublicWriteAccess = function(allowed) {
    return this.setWriteAccess("*", allowed);
  };
  Acl.prototype.setUserWriteAccess = function(user, allowed) {
    if(!user.objectId){
      throw new errors.NoObjectIdError();
    }
    return this.setWriteAccess(user.objectId, allowed);
  };
  Acl.prototype.setUserReadAccess = function(user, allowed) {
    if(!user.objectId){
      throw new errors.NoObjectIdError();
    }
    return this.setReadAccess(user.objectId, allowed);
  };
  Acl.prototype.setRoleWriteAccess = function(roleName, allowed) {
    if(roleName instanceof ncmb.Role){
      roleName = roleName.roleName;
    }
    if(typeof roleName !== "string" || roleName === ""){
      throw new errors.NoRoleNameError();
    }
    var role = "role:" + roleName;
    return this.setWriteAccess(role, allowed);
  };
  Acl.prototype.setRoleReadAccess = function(roleName, allowed) {
    if(roleName instanceof ncmb.Role){
      roleName = roleName.roleName;
    }
    if(typeof roleName !== "string" || roleName === ""){
      throw new errors.NoRoleNameError();
    }
    var role = "role:" + roleName;
    return this.setReadAccess(role, allowed);
  };
  Acl.prototype.toJSON = function() {
    var permissions = {};
    for(var target in this){
      if(typeof this[target] !== "function"){
        permissions[target] = this[target];
      }
    }
    return permissions;
  };
  return Acl;
};
