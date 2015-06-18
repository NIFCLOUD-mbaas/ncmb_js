"use strict";

var Query = require("./query");
var Errors = require("./errors");

var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage('./scratch');

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
  var className = User.prototype.className = "/users";
  var CURRENT_USER_PATH = "currentUser";

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

  User.login = function(user, callback){
    if(!user.password || ! user.userName && ! user.mailAddress ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError());
    }
    var bodyobj = new Object;
    if(user.userName){
      bodyobj.userName = user.userName;
    }else{
      bodyobj.mailAddress = user.mailAddress
    }
    bodyobj.password = user.password;
   
    return ncmb.request({
      path: "/" + ncmb.version + "/login",
      method: "GET",
      query: bodyobj
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      user.objectId = obj.objectId;
      ncmb.sessionToken = obj.sessionToken;
      try{
        setItem(CURRENT_USER_PATH, JSON.stringify(user));
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

  User.logout = function(callback){
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

  var setItem = function(key, value){
    try{
      localStorage.setItem(makeStoragePath(key, ncmb.apikey), value);
    }catch(err){
      throw err;
    }
  };

  var makeStoragePath = function(key, apikey){
    if(!key) throw new Error("Key is undefined");
    if(!apikey) throw new Error("apikey is undefined");
    var path = "NCMB/" + apikey + "/" + key;
    return path;
  };

  ncmb.collections[className] = User;
  return User;
};
