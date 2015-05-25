"use strict";

var Acl = module.exports = function(ncmb) {
   
    Acl.prototype.ncmb = ncmb;

    function Acl() {
      this._json = {};
    };

    Acl.prototype.setPublicReadAccess = function(isPubRead) {
      this._json = isPubRead ? '{"*":{"read":true}}' : '{"*":{"read":false}}';
    };

    Acl.prototype.setPublicWriteAccess = function(isPubWrite) {
      this._json = isPubWrite ? '{"*":{"write":true}}' : '{"*":{"write":false}}';
    };

    Acl.prototype._toJSON = function() {
   	    return this._json;
    };

    return Acl;
};