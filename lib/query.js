"use strict";

var qs = require("qs");

// class method
var Query = module.exports = (function(){
  function Query(ncmb, className){
    this.__proto__.ncmb = ncmb;
    this._className = className;
    this._where  = {};
    this._limit  = 0;
    this._skip = 0;
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
  Query.prototype.EqualTo = function(key, value){
    return setOperand(this, key, value);
  };
  Query.prototype.notEqualTo = function(key, value){
    return setOperand(this, key, value, "$ne");
  };
  Query.prototype.lessThan = function(key, value){
    return setOperand(this, key, value, "$lt");
  };
  Query.prototype.lessThanOrEqualTo = function(key, value){
    return setOperand(this, key, value, "$lte");
  };
  Query.prototype.greaterThan = function(key, value){
    return setOperand(this, key, value, "$gt");
  };
  Query.prototype.greaterThanOrEqualTo = function(key, value){
    return setOperand(this, key, value, "$gte");
  };
  Query.prototype.in = function(key, value){
    return setOperand(this, key, value, "$in");
  };
  Query.prototype.notIn = function(key, value){
    return setOperand(this, key, value, "$nin");
  };
  Query.prototype.inArray = function(key, value){
    if(!(value instanceof Array)){
      throw new this.ncmb.Errors.InvalidArgumentError();
    }
    return setOperand(this, key, value, "$inArray");
  };
  Query.prototype.notInArray = function(key, value){
    if(!(value instanceof Array)){
      throw new this.ncmb.Errors.InvalidArgumentError();
    }
    return setOperand(this, key, value, "$ninArray");
  };
  Query.prototype.allInArray = function(key, value){
    if(!(value instanceof Array)){
      throw new this.ncmb.Errors.InvalidArgumentError();
    }
    return setOperand(this, key, value, "$all");
  };
  Query.prototype.exists = function(key, value){
    return setOperand(this, key, value, "$exists");
  };
  Query.prototype.regularExpressionTo = function(key, value){
    if(typeof value !== "string"){
      throw new this.ncmb.Errors.InvalidArgumentError();
    }
    return setOperand(this, key, value, "$regex");
  };
  Query.prototype.or = function(value){
    if(!(value instanceof Array)){
      throw new this.ncmb.Errors.InvalidArgumentError();
    }
    var wheres = [];
    for(var i = 0; i < value.length; i++){
      wheres[i] = value[i]._where; 
    }
    this._where = {"$or":wheres}
    return this;
  };


  Query.prototype.select = function(key, value){
    var className = null;
    if(value._className === "/users"){
      className = "user";
    }else if(value._className === "/roles"){
      className = "role";
    }else{
      className = value._className.slice(9);
    }
    //var query = {query: {className: value.className, where: value._where}};
    this._where = this._where || {};
    this._where[key] = this._where[key] || {};
    this._where[key]["$select"] = {className: className, where: value._where};
    return this;
  };
  var setOperand = function(query, key, value, operand){
    if(typeof key !== "string"){
      throw new this.ncmb.Errors.InvalidArgumentError();
    }
    if(operand === undefined){
      query._where = query._where || {};
      query._where[key] = value;
      return query;
    }
    query._where = query._where || {};
    query._where[key] = query._where[key] ||{};
    query._where[key][operand] = value;
    return query;
  };
  Query

  Query.prototype.include = function(key){
    this._include = key;
    return this;
  };
  Query.prototype.count = function(){
    this._count = 1;
    return this;
  };
  Query.prototype.order = function(key, descending){
    var symbol = "";
    if(descending) symbol = "-";
    if(!this._order){
      this._order = symbol + key;
    }else{
      this._order = this._order + "," + symbol + key;
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
  Query.prototype.skip = function(skip){
    skip = +skip;
    if(typeof skip !== "number" && skip > -1)
      throw new this.ncmb.Errors.InvalidskipError("skip は number で指定して下さい");
    this._skip = skip;
    return this;
  };
  Query.prototype.fetchById = function(id, callback){
    var path = "/" + this.ncmb.version + this._className + "/" + id;
    return this.ncmb.request({
      path: path,
      method: "GET",
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      if(callback) return callback(null, obj);
      return obj;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
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
    if(this._skip) opts.push("skip="+this._skip);
    if(this._count) opts.push("count="+this._count);
    if(this._include) opts.push("include="+this._include);
    if(this._order) opts.push("order="+this._order);

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
        if(JSON.parse(data).count){
          objects.count = JSON.parse(data).count;
        }
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
