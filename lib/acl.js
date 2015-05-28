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
      if(!this._json["*"])
        this._json["*"] = {};
      isPubRead ? this._json["*"].read = true   :   this._json["*"].read = false;
    };

    Acl.prototype.setPublicWriteAccess = function(isPubWrite) {
      if(!this._json["*"])
        this._json["*"] = {};
      isPubWrite ? this._json["*"].write = true   :   this._json["*"].write = false;
    };

    Acl.prototype.toJSON = function() {
      return this._json;
    };

    return Acl;
};