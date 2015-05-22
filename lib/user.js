"use strict";

var Query = require("./query");
var Errors = require("./errors");

var User = module.exports = function(ncmb){
  var reserved = [
    "save", "update", "delete", "login", "logout",
    "className", "mailAddressConfirm", "requestPasswordReset"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  }

  function User(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }
      }
    }
  }
  var className = User.__proto__.className = User.prototype.className = "/users";

  User.where     = function(where){        return new Query(ncmb, className).where(where);};
  User.limit     = function(limit){        return new Query(ncmb, className).limit(limit);};
  User.offset    = function(offset){       return new Query(ncmb, className).offset(offset);};
  User.fetchAll  = function(callback){     return new Query(ncmb, className).fetchAll(callback);};
  User.fetch     = function(callback){     return new Query(ncmb, name).fetch(callback);};
  User.fetchById = function(id, callback){ return new Query(ncmb, name).fetchById(id, callback);};

  User.prototype.save = function(callback){
    return ncmb.request({
      path: "/" + ncmb.version + "/users",
      method: "POST",
      data: this
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      this.objectId = obj.objectId;
      this.createDate = obj.createDate;

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };
  User.prototype.update = function(){};
  User.prototype.delete = function(callback){
    if (!this.objectId) {
       return ( callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError());
    }
    return ncmb.request({
      path: "/" + ncmb.version + "/users/" + this.objectId,
      method: "DEL"
    }).then(function(){
      if(callback) return callback(null);
      return;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.prototype.login = function(callback){
    return ncmb.request({
      path: "/" + ncmb.version + "/login",
      method: "GET",
      query: {
        password: this.password,
        userName: this.userName
      }
    }, function(data, res){
      if(res.status === 200){
        if(callback) return callback(null, true, res);
        return true;
      }else{
        if(callback) return callback(new Error("invalid"), false, res);
        throw err;
      }
    });
  };
  User.prototype.logout = function(callback){
    return ncmb.request({
      path: "/" + ncmb.version + "/logout",
      method: "GET"
    }, function(data, res){
      if(res.status === 200){
        if(callback) return callback(null, true, res);
        return true;
      }else{
        if(callback) return callback(new Error("invalid"), false, res);
        throw err;
      }
    });
  };

  User.prototype.mailAddressConfirm = function(){};
  User.prototype.requestPasswordReset = function(){};

  ncmb.collections[className] = User;
  return User;
};
