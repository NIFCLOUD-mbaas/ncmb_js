"use strict";

var Errors = require("./errors");
var Acl = module.exports = function(ncmb) {
  var reserved = [
    "set", "setReadAccess", "setWriteAccess",
    "setPublicReadAccess", "setPublicWriteAccess",
    "setUserReadAccess", "setUserWriteAccess",
    "setRoleReadAccess", "setRoleWriteAccess",
    "toJSON"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  function Acl(permissions) {
    if(permissions) {
      Object.keys(permissions).forEach(function(key){
        if(isReserved(key)){
          throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
        }
        if(permissions[key] && (permissions[key].read || permissions[key].write)){
          this[key] = permissions[key];
        }else{
          throw new Errors.InvalidArgumentError("Argument format is invalid.");
        }
      }.bind(this));
    }
  };

  Acl.prototype.set = function(target, type, allowed) {
    if(isReserved(target)){
      throw new Errors.UnReplaceableKeyError(target + " cannot be set, it is reserved.");
    }
    this[target] = this[target] || {};
    this[target][type] = allowed;
    return this;
  };
  Acl.prototype.setReadAccess        = function(target, allowed) {
    return this.set(target, "read", allowed);
  };
  Acl.prototype.setWriteAccess       = function(target, allowed) {
    return this.set(target, "write", allowed);
  };
  Acl.prototype.setPublicReadAccess  = function(allowed) {
    return this.setReadAccess("*", allowed);
  };
  Acl.prototype.setPublicWriteAccess = function(allowed) {
    return this.setWriteAccess("*", allowed);
  };
  Acl.prototype.setUserWriteAccess   = function(user, allowed) {
    if(!(user instanceof ncmb.User)){
      throw new Errors.InvalidArgumentError("First argument must be instance of ncmb.User.");
    }
    if(!user.objectId){
      throw new errors.NoObjectIdError("This user doesn't have objectId. Input user must be saved.");
    }
    return this.setWriteAccess(user.objectId, allowed);
  };
  Acl.prototype.setUserReadAccess    = function(user, allowed) {
    if(!(user instanceof ncmb.User)){
      throw new Errors.InvalidArgumentError("First argument must be instance of ncmb.User.");
    }
    if(!user.objectId){
      throw new errors.NoObjectIdError("This user doesn't have objectId. Input user must be saved.");
    }
    return this.setReadAccess(user.objectId, allowed);
  };
  Acl.prototype.setRoleWriteAccess   = function(roleName, allowed) {
    if(roleName instanceof ncmb.Role){
      roleName = roleName.roleName;
    }
    if(typeof roleName !== "string" || roleName === ""){
      throw new Errors.NoRoleNameError("First argument must be roleName string or ncmb.Role instance that has roleName.");
    }
    var role = "role:" + roleName;
    return this.setWriteAccess(role, allowed);
  };
  Acl.prototype.setRoleReadAccess    = function(roleName, allowed) {
    if(roleName instanceof ncmb.Role){
      roleName = roleName.roleName;
    }
    if(typeof roleName !== "string" || roleName === ""){
      throw new Errors.NoRoleNameError("First argument must be roleName string or ncmb.Role instance that has roleName.");
    }
    var role = "role:" + roleName;
    return this.setReadAccess(role, allowed);
  };
  Acl.prototype.get = function(target, type){
    if(target && target.objectId) target = target.objectId;
    if(typeof target !== "string"){
      throw new Errors.InvalidArgumentError("First argument must be string or saved object.");
    }
    if(type !== "read" && type !== "write"){
      throw new Errors.InvalidArgumentError("Secondargument must be 'read' or 'write' only.");
    }
    if(target === "public") target = "*";
    if(!this[target]) return null;
    if(this[target][type] === false){
      return false;
    }else if(!this[target][type]){
      return null;
    }
    return this[target][type];
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
