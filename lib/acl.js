"use strict";

var Acl = module.exports = function(ncmb) {
  function Acl(permissions) {
    this.permissions = {};
    if(permissions) {
      Object.keys(permissions).forEach(function(key){
        if(permissions[key] && (permissions[key].read || permissions[key].write) ) {
          this.permissions[key] = permissions[key];
        }
      }.bind(this));
    }
  };

  Acl.prototype.set = function(target, type, allowed) {
    this.permissions[target] = this.permissions[target] || {};
    this.permissions[target][type] = allowed;
    return this;
  }
  Acl.prototype.setReadAccess = function(target, allowed) {
    return this.set(target, "read", allowed);
  }
  Acl.prototype.setWriteAccess = function(target, allowed) {
    return this.set(target, "write", allowed);
  }
  Acl.prototype.setPublicReadAccess = function(allowed) {
    return this.setReadAccess("*", allowed);
  };
  Acl.prototype.setPublicWriteAccess = function(allowed) {
    return this.setWriteAccess("*", allowed);
  };

  Acl.prototype.toJSON = function() {
    return this.permissions;
  };

  return Acl;
};
