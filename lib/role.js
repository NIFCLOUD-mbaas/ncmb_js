"use strict";
var Errors       = require("./errors");
var Query        = require("./query");
var Operation    = require("./operation");
var objectAssign = require('object-assign');

var Role = module.exports = function(ncmb){
  var reserved = [
    "save", "update", "delete", "className",
    "addUser", "addRole", "removeUser", "removeRole",
    "fetchUser", "fetchRole",
    "belongUser","belongRole"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  var unreplaceable =[
    "objectId", "createDate", "updateDate", "_id"
  ];

  var isReplaceable = function(key){
    if(unreplaceable.indexOf(key) === -1) return true;
    return false;
  };

  function Role(roleName, attrs){
    if(!roleName) throw new Error("roleName required");
    if(roleName instanceof Object && roleName.roleName && typeof roleName.roleName === "string"){
      attrs = roleName;
    }else if(typeof roleName === "string"){
      this.roleName = roleName;
    }else{
      throw new Errors.InvalidArgumentError();
    }
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }
      }
    }
  }
  var className = Role.prototype.className = "/roles";

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      Role[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });
  Object.keys(Operation.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Operation.prototype[attr] === "function"){
      Role.prototype[attr] = function(){
        var operation = new Operation(reserved);
        return operation[attr].apply(this, [].slice.apply(arguments));
      };
    }
  });

  Role.prototype.save = function(callback){
    return ncmb.request({
      path:   "/" + ncmb.version + this.className,
      method: "POST",
      data:   this
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      objectAssign(this, obj);
      Object.keys(this).forEach(function (key) {
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };
  Role.prototype.update = function(callback){
    if(!this.objectId) {
      return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError());
    }
    var dataToUpdate = {};
    Object.keys(this).forEach(function (key) {
      if(!isReplaceable(key)) return;
      dataToUpdate[key] = this[key];
    }.bind(this));

    return ncmb.request({
      path:   "/" + ncmb.version + this.className + "/" + this.objectId,
      method: "PUT",
      data:   dataToUpdate
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      this.updateDate = obj.updateDate;
      Object.keys(this).forEach(function (key) {
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };
  Role.prototype.delete = function(callback){
    if(!this.objectId){
      var err = new Errors.NoObjectIdError();
      return callback ? callback(err) : Promise.reject(err);
    }
    return ncmb.request({
      path: "/" + ncmb.version + this.className + "/" + this.objectId,
      method: "DEL"
    }).then(function(){
      if(callback) return callback(null, true);
      return true;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  ["user", "role"].forEach(function(classname){
    var upper = classname[0].toUpperCase() + classname.substr(1);
    var key = "belong" + upper;
    ["add", "remove"].forEach(function(method){
      var methodName = method + upper;
      Role.prototype[methodName] = function(object){
        if(this[key] instanceof ncmb.Relation){
          this[key][method](object);
          return this;
        }
        this[key] = new ncmb.Relation(classname)[method](object);
        return this;
      };
    });
    var fetchName = "fetch" + upper;
    Role.prototype[fetchName] = function(callback){
      return ncmb[upper].relatedTo(this,key).fetchAll(callback);
    };
  });

  ncmb.collections[className] = Role;
  return Role;
};
