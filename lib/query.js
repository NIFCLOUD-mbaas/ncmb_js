"use strict";

var qs = require("qs");

// class method
var Query = module.exports = (function(){
  function Query(ncmb, className){
    this.__proto__.ncmb = ncmb;
    this._className = className;
    this._where  = {};
    this._limit  = 0;
    this._offset = 0;
  };

  Query.prototype.where = function(where){
    if(typeof where !== "object")
      throw new this.ncmb.Errors.InvalidWhereError("where は object で指定して下さい");
    for(var key in where){
      if(where.hasOwnProperty(key)){
        this._where[key] = where[key];
      }
    }
    return this;
  };
  Query.prototype.limit = function(limit){
    limit = +limit;
    if(typeof limit !== "number" && limit > -1)
      throw new this.ncmb.Errors.InvalidLimitError("limit は number で指定して下さい");
    this._limit = limit;
    return this;
  };
  Query.prototype.offset = function(offset){
    offset = +offset;
    if(typeof offset !== "number" && offset > -1)
      throw new this.ncmb.Errors.InvalidOffsetError("offset は number で指定して下さい");
    this._offset = offset;
    return this;
  };
  Query.prototype.fetchById = function(id, callback){
    this._where = {objectId: id};
    return this.fetchAll().then(function(objects){
      if(callback) return callback(null, objects[0]);
      return objects[0];
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    })
  };
  Query.prototype.fetch = function(callback){
    this._limit = 1;
    return this.fetchAll().then(function(objects){
      if(callback) return callback(null, objects[0]);
      return objects[0];
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    })
  };
  Query.prototype.fetchAll = function(callback){
    var path = "/" + this.ncmb.version + this._className;
    var opts = [];
    if(Object.keys(this._where).length !== 0) opts.push("where="+JSON.stringify(this._where));
    if(this._limit) opts.push("limit="+this._limit);
    if(this._offset) opts.push("offset="+this._offset);

    var Klass = this.ncmb.collections[this._className];
    if(typeof Klass === "undefined")
      Promise.reject(new Error("no class definition `" + this._className +"`"));
    return this.ncmb.request({
      path: path,
      method: "GET",
      query: qs.parse(opts.join("&"))
    }).then(function(data){
      try{
        var objects = JSON.parse(data).results;
        objects = objects.map(function(obj){
          return new Klass(obj);
        });
      }catch(err){
        if(callback) return callback(err, null);
        throw err;
      }
      if(callback) return callback(null, objects);
      return objects;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };
  return Query;
})();
