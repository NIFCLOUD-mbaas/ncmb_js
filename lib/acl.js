"use strict";

var Acl = module.exports = function(ncmb) {
   
    Acl.prototype.ncmb = ncmb;

    function Acl() {
      this._json = {};
    };

    Acl.prototype.setPublicReadAccess = function(bool) {
      if(bool) {
        this._json = '{"*": {"read" : true}}';
      } else {
        this._json = '{"*": {"read" : true}}';
      } 
    };

    Acl.prototype._toJSON = function() {
   	    return this._json;
    };

    return Acl;
};