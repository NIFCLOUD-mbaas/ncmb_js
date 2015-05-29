"use strict";

var Acl = module.exports = function(ncmb) {
   
    Acl.prototype.ncmb = ncmb;

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
    }
    Acl.prototype.setReadAccess = function(target, allowed) {
      this.set(target, "read", allowed);
    }
    Acl.prototype.setWriteAccess = function(target, allowed) {
      this.set(target, "write", allowed);
    }
    Acl.prototype.setPublicReadAccess = function(allowed) {
      this.setReadAccess("*", allowed);
    };
    Acl.prototype.setPublicWriteAccess = function(allowed) {
      this.setWriteAccess("*", allowed);
    };

    Acl.prototype.toJSON = function() {
      return this.permissions;
    };

    return Acl;
};