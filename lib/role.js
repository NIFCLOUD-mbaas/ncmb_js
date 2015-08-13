"use strict";
var Errors       = require("./errors");
var Query        = require("./query");
var objectAssign = require('object-assign');

var Role = module.exports = function(ncmb){
  var reserved = [
    "save", "update", "delete", "className",
    "addUser", "addSubRole",
    "belongUser","belongRole"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  }

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

  Role.prototype.save = function(callback){
    return ncmb.request({
      path:   "/" + ncmb.version + this.className,
      method: "POST",
      data:   this
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      objectAssign(this, obj);

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
    var dataToSave = {};
    Object.keys(this).forEach(function (key) {
      if (["objectId", "createDate", "updateDate"].indexOf(key) == -1) {
        dataToSave[key] = this[key];
      }
    }.bind(this));
    return ncmb.request({
      path:   "/" + ncmb.version + this.className + "/" + this.objectId,
      method: "PUT",
      data:   dataToSave
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      objectAssign(this, obj);

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

  Role.prototype.addUser = function(user){
    if(this.belongUser instanceof ncmb.Relation){
      return this.belongUser.add(user);
    }
    this.belongUser = new ncmb.Relation("user").add(user);
    return this;
  };

  Role.prototype.addSubRole = function(role){
    if(this.belongRole instanceof ncmb.Relation){
      return this.belongRole.add(role);
    }
    this.belongRole = new ncmb.Relation("role").add(role);
    return this;
  };

  Role.prototype.fetchUser = function(callback){
    return ncmb.User.relatedTo(this,"belongUser").fetchAll(callback);
  };
  Role.prototype.fetchSubRole = function(callback){
    return ncmb.Role.relatedTo(this,"belongRole").fetchAll(callback);
  };

  ncmb.collections[className] = Role;
  return Role;
};
