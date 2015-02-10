"use strict";

var qs = require("querystring");

// class method
var Query = module.exports = (function(){
  function Query(ncmb, className){
    this.__proto__.ncmb = ncmb;
    this.__proto__.className = className
    this.where  = {};
    this.limit  = 0;
    this.offset = 0;
  };

  Query.prototype.where = function(where){
    if(typeof where !== "object")
      throw new Errors.InvalidWhereError("where は object で指定して下さい");
    for(var key in where){
      if(where.hasOwnProperty(key)){
        this.where[key] = where[key];
      }
    }
    return this;
  };
  Query.prototype.limit = function(limit){
    limit = +limit;
    if(typeof limit !== "number" && limit > -1)
      throw new Errors.InvalidLimitError("limit は number で指定して下さい");
    this.limit = limit;
    return this;
  };
  Query.prototype.offset = function(offset){
    offset = +offset;
    if(typeof offset !== "number" && offset > -1)
      throw new Errors.InvalidOffsetError("offset は number で指定して下さい");
    this.offset = offset;
    return this;
  };
  Query.prototype.fetchById = function(id, callback){
    this.limit = 1;
    this.where = {ObjectId: id};
    // うまいことfetchAllを使おう
  };
  Query.prototype.fetch = function(callback){
    this.limit = 1;
    // うまいことfetchAllを使おう
  };
  Query.prototype.fetchAll = function(callback){
    var path = "/" + this.ncmb.version + "/classes/" + this.className;
    var opts = []
    if(this.where) opts.push("where="+qs.stringify(this.where));
    if(this.limit) opts.push("limit="+this.limit);
    if(this.offset) opts.push("offset="+this.offset);
    if(opts.length > 0) path += "?" + opts.join("&");
    return this.ncmb.request({
      path: path,
      method: "POST",
      data: this
    }, callback);
  };
  return Query;
})();
