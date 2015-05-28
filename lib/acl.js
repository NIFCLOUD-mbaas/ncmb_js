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

    Acl.prototype.setPublicReadAccess = function(isPubRead) {
      if(!this.permissions["*"])
        this.permissions["*"] = {};
      isPubRead ? this.permissions["*"].read = true   :   this.permissions["*"].read = false;
    };

    Acl.prototype.setPublicWriteAccess = function(isPubWrite) {
      if(!this.permissions["*"])
        this.permissions["*"] = {};
      isPubWrite ? this.permissions["*"].write = true   :   this.permissions["*"].write = false;
    };

    Acl.prototype.toJSON = function() {
      return this.permissions;
    };

    return Acl;
};