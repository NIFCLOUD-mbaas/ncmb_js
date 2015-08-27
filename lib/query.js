"use strict";

var qs = require("qs");
var Errors = require("./errors");

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
      throw new Errors.InvalidWhereError("where は object で指定して下さい");
    for(var key in where){
      if(where.hasOwnProperty(key)){
        this._where[key] = where[key];
      }
    }
    return this;
  };
  Query.prototype.equalTo              = function(key, value){
    return setOperand(this, key, value);};
  Query.prototype.notEqualTo           = function(key, value){
    return setOperand(this, key, value, "$ne");};
  Query.prototype.lessThan             = function(key, value){
    return setOperand(this, key, value, "$lt");};
  Query.prototype.lessThanOrEqualTo    = function(key, value){
    return setOperand(this, key, value, "$lte");};
  Query.prototype.greaterThan          = function(key, value){
    return setOperand(this, key, value, "$gt");};
  Query.prototype.greaterThanOrEqualTo = function(key, value){
    return setOperand(this, key, value, "$gte");};
  Query.prototype.in                   = function(key, value){
    if(!Array.isArray(value)) throw new Errors.InvalidArgumentError("Value must be array.");
    return setOperand(this, key, value, "$in");};
  Query.prototype.notIn                = function(key, value){
    if(!Array.isArray(value)) throw new Errors.InvalidArgumentError("Value must be array.");
    return setOperand(this, key, value, "$nin");};
  Query.prototype.exists               = function(key, value){
    if(typeof value !== "boolean") throw new Errors.InvalidArgumentError("Value must be boolean.");
    return setOperand(this, key, value, "$exists");};
  Query.prototype.regularExpressionTo  = function(key, value){
    if(typeof value !== "string") throw new Errors.InvalidArgumentError("Value must be string.");
    return setOperand(this, key, value, "$regex");};
  Query.prototype.inArray              = function(key, value){
    if(!Array.isArray(value)) value = [value];
    return setOperand(this, key, value, "$inArray");};
  Query.prototype.notInArray           = function(key, value){
    if(!Array.isArray(value)) value = [value];
    return setOperand(this, key, value, "$ninArray");};
  Query.prototype.allInArray           = function(key, value){
    if(!Array.isArray(value)) value = [value];
    return setOperand(this, key, value, "$all");};

  Query.prototype.near  = function(key, location){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new this.ncmb.Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    return setOperand(this, key, location.toJSON(), "$nearSphere");
  };
  Query.prototype.withinKilometers = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInKilometers"] = maxDistance;
    return this;
  };
  Query.prototype.withinMiles = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInMiles"] = maxDistance;
    return this;
  };
  Query.prototype.withinRadians = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInRadians"] = maxDistance;
    return this;
  };
  Query.prototype.withinSquare = function(key, southWestVertex, northEastVertex){
    if(!(southWestVertex instanceof this.ncmb.GeoPoint) || !(northEastVertex instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    var box = {"$box":[southWestVertex.toJSON(), northEastVertex.toJSON()]};
    setOperand(this, key, box, "$within");
    return this;
  };

  Query.prototype.or = function(subqueries){
    if(!Array.isArray(subqueries)){
      subqueries = [subqueries];
    }
    this._where        = this._where        || {};
    this._where["$or"] = this._where["$or"] || [];
    for(var i = 0; i < subqueries.length; i++){
      if(!subqueries[i]._where) throw new Errors.InvalidArgumentError("Argument is invalid. Input query or array of query.");
      this._where["$or"].push(subqueries[i]._where);
    }
    return this;
  };
  Query.prototype.select = function(key, subkey, subquery){
    if(typeof key !== "string" || typeof subkey !== "string"){
      throw new Errors.InvalidArgumentError("Key and subkey must be string");
    }
    if(!subquery._className) throw new Errors.InvalidArgumentError("Third argument is invalid. Input query.");
    var className = null;
    if(subquery._className === "/users"){
      className = "user";
    }else if(subquery._className === "/roles"){
      className = "role";
    }else{
      className = subquery._className.slice(9);
    }
    this._where                 = this._where      || {};
    this._where[key]            = this._where[key] || {};
    this._where[key]["$select"] = {query:{className: className, where: subquery._where} , key: subkey};
    return this;
  };
  Query.prototype.relatedTo = function(object, key){
    var className = null;
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(!object.className)       throw new Errors.InvalidArgumentError("First argument requires saved object.");
    if(!object.objectId){
      throw new Errors.NoObjectIdError("First argument requires saved object.");
    }
    if(object instanceof this.ncmb.User){
      className = "user";
    }else if(object instanceof this.ncmb.Role){
      className = "role";
    }else{
      className = object.className.slice(9);
    }
    this._where = this._where || {};
    this._where["$relatedTo"] = {object: {__type: "Pointer", className: className, objectId: object.objectId}, key: key};
    return this;
  };
  Query.prototype.inQuery = function(key, subquery){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(!subquery._className)    throw new Errors.InvalidArgumentError("Second argument is invalid. Input query.");
    var className = null;
    if(subquery._className === "/users"){
      className = "user";
    }else if(subquery._className === "/roles"){
      className = "role";
    }else{
      className = subquery._className.slice(9);
    }
    this._where = this._where || {};
    this._where[key] = this._where[key] ||{};
    this._where[key]["$inQuery"]= {where: subquery._where, className: className};
    return this;
  };

  Query.prototype.include = function(key){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(!this._include){
      this._include = key;
    }else{
      this._include = this._include + "," + key;
    }
    return this;
  };
  Query.prototype.count = function(){
    this._count = 1;
    return this;
  };
  Query.prototype.order = function(key, descending){
    var symbol = "";
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(descending && typeof descending !== "boolean"){
      throw new Errors.InvalidArgumentError("Second argument must be boolean.");
    }
    if(descending === true) symbol = "-";
    if(!this._order){
      this._order = symbol + key;
    }else{
      this._order = this._order + "," + symbol + key;
    }
    return this;
  };
  Query.prototype.limit = function(limit){
    if(typeof limit !== "number"){
      throw new Errors.InvalidLimitError("Limit must be number.");
    }
    if(limit < 1 || limit >1000){
      throw new Errors.InvalidLimitError("Limit must be renge of 1~1000.");
    }
    this._limit = limit;
    return this;
  };
  Query.prototype.skip = function(skip){
    if(typeof skip !== "number") throw new Errors.InvalidskipError("Skip must be number.");
    if(skip < 0) throw new Errors.InvalidskipError("Skip must be greater than 0.");
    this._skip = skip;
    return this;
  };

  Query.prototype.fetchById = function(id, callback){
    var path = "/" + this.ncmb.version + this._className + "/" + id;
    var Klass = this.ncmb.collections[this._className];
    if(typeof Klass === "undefined"){
      return Promise.reject(new Error("no class definition `" + this._className +"`"));
    }

    return this.ncmb.request({
      path: path,
      method: "GET"
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      var object = new Klass(obj);
      if(object.acl) object.acl = new this.ncmb.Acl(object.acl);
      if(callback) return callback(null, object);
      return object;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };
  Query.prototype.fetch = function(callback){
    this._limit = 1;
    return this.fetchAll().then(function(objects){
      if(!objects[0]){
        if(callback) return callback(null, {});
        return {};
      }
      if(callback) return callback(null, objects[0]);
      return objects[0];
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };
  Query.prototype.fetchAll = function(callback){
    var path = "/" + this.ncmb.version + this._className;
    var opts = [];
    if(Object.keys(this._where).length !== 0) opts.push("where=" + JSON.stringify(this._where));
    if(this._limit)    opts.push("limit="   + this._limit);
    if(this._skip)     opts.push("skip="    + this._skip);
    if(this._count)    opts.push("count="   + this._count);
    if(this._include)  opts.push("include=" + this._include);
    if(this._order)    opts.push("order="   + this._order);

    var Klass = this.ncmb.collections[this._className];
    if(typeof Klass === "undefined"){
      return Promise.reject(new Error("no class definition `" + this._className +"`"));
    }
    return this.ncmb.request({
      path: path,
      method: "GET",
      query: qs.parse(opts.join("&"))
    }).then(function(data){
      try{
        var objects = JSON.parse(data).results;
        objects = objects.map(function(obj){
          var object = new Klass(obj);
          if(object.acl) object.acl = new this.ncmb.Acl(object.acl);
          return object;
        }.bind(this));
        if(JSON.parse(data).count){
          objects.count = JSON.parse(data).count;
        }
      }catch(err){
        if(callback) return callback(err, null);
        throw err;
      }
      if(callback) return callback(null, objects);
      return objects;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  var setOperand = function(query, key, value, operand){
    if(typeof key !== "string"){
      throw new Errors.InvalidArgumentError("Key must be string.");
    }
    if(operand === undefined){
      query._where      = query._where || {};
      query._where[key] = value;
      return query;
    }
    query._where               = query._where      || {};
    query._where[key]          = query._where[key] || {};
    query._where[key][operand] = value;
    return query;
  };
  return Query;
})();
