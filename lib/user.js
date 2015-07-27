"use strict";

var Query = require("./query");
var Errors = require("./errors");
var objectAssign = require('object-assign');
var localStorage = null;
if(typeof window !== "undefined"){
  localStorage = require("localForage");
}else{
  localStorage = new require("node-localstorage").LocalStorage("./scratch");
}

var User = module.exports = function(ncmb){
  var reserved = [
    "save", "update", "delete", "login", "logout",
    "className", "mailAddressConfirm", "requestPasswordReset",
    "loginAsAnonymous"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  var unreplaceable =[
    "objectId", "password", "createDate", "updateDate", "mailAddressConfirm", "_id"
  ];

  var isReplaceable = function(key){
    if(unreplaceable.indexOf(key) === -1) return true;
    return false;
  };

  var CURRENT_USER_PATH  = "currentUser";

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

  User.where     = function(where){        return new Query(ncmb, className).where(where);};
  User.limit     = function(limit){        return new Query(ncmb, className).limit(limit);};
  User.offset    = function(offset){       return new Query(ncmb, className).offset(offset);};
  User.fetchAll  = function(callback){     return new Query(ncmb, className).fetchAll(callback);};
  User.fetch     = function(callback){     return new Query(ncmb, className).fetch(callback);};
  User.fetchById = function(id, callback){ return new Query(ncmb, className).fetchById(id, callback);};

  User.getCurrentUser = function(){
    if(currentUser = getItem(CURRENT_USER_PATH)){
      return ncmb.currentUser = JSON.parse(currentUser);
    }
    return null;
  };

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

  User.prototype.requestPasswordReset = function(callback){
    if (! this.mailAddress) {
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoMailAddressError());
    }
    return ncmb.request({
      path: "/" + ncmb.version + "/requestPasswordReset",
      method: "POST",
      data: {'mailAddress': this.mailAddress }
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

  User.prototype.update = function(callback){
    if (!this.objectId) {
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError());
    }

    var replaceProperties = {};
    Object.keys(this).forEach(function(key){
      if(!isReplaceable(key)) return;
      replaceProperties[key] = this[key];
    }.bind(this));

    return ncmb.request({
      path: "/" + ncmb.version + "/users/" + this.objectId,
      method: "PUT",
      data: replaceProperties
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      this.updateDate = obj.updateDate;

      if(callback) return callback(null, obj);
      return obj;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

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

  User.login = function(userName, password, callback){
    var user = null;
    if(userName instanceof ncmb.User){
      callback = password;
      user = userName;
      userName = user.userName;
      password = user.password;
    }
    if(typeof password === "function"){
      callback = password;
      password = null;
    }
    if(!userName || !password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError());
    }
    if(!user){
      user = new User({userName: userName, password: password});
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.login(callback).then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.prototype.login = function(callback){
    if(this.sessionToken) return (callback || Promise.resolve.bind(Promise))(this);

    if(!this.userName || !this.password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError());
    }

    return ncmb.request({
      path: "/" + ncmb.version + "/login",
      method: "GET",
      query: {
        userName: this.userName,
        password: this.password
      }
    }).then(function(data){
      try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      this.objectId = obj.objectId;
      this.sessionToken = obj.sessionToken;

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.loginAsAnonymous = function(uuid, callback){
    var user = null;
    if(typeof uuid === "function"){
      callback = uuid;
      uuid = null;
    }
    if(uuid instanceof ncmb.User){
      user = uuid;
      uuid = null;
    }
    if(!user){
      user = new User();
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.loginAsAnonymous(uuid).then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.prototype.loginAsAnonymous = function(uuid, callback){
    if(typeof uuid === "function"){
      callback = uuid;
      uuid = null;
    }
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve.bind(Promise)(this);
    }
    if(this.userName){
      return ( callback || Promise.reject.bind(Promise))(new Errors.ContentsConflictError());
    }
    if(this.authData && !this.authData.anonymous){
      return ( callback || Promise.reject.bind(Promise))(new Errors.InvalidAuthInfoError());
    }
    if(!uuid){
      if(this.authData && this.authData.anonymous && this.authData.anonymous.id){
        uuid = this.authData.anonymous.id;
      } else if (this.uuid){
        uuid = this.uuid;
      } else{
        uuid = getDeviceId();
      }
    }
    var regexp = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;
    if(!regexp.test(uuid)){
      return ( callback || Promise.reject.bind(Promise))(new Errors.InvalidFormatError());
    };
    this.authData = {};
    this.authData.anonymous = {};
    this.authData.anonymous.id = uuid;

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
      objectAssign(this, obj);

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
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
        removeItem(CURRENT_USER_PATH);
        if(callback) return callback(null, true, res);
        return true;
      }else{
        var err = callback(new Error("invalid"), false, res);
        if(callback) return err;
        throw err;
      }
    });
  };

  User.prototype.mailAddressConfirm = function(){};

  var monaca = null;
  var getDeviceId = function(){
    if(monaca && monaca.getDeviceId){
      return monaca.getDeviceId();
    }
    var S4 = function(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };

  var makeStoragePath = function(key, apikey){
    if(!key) throw new Error("Key is undefined");
    if(!apikey) throw new Error("apikey is undefined");
    var path = "NCMB/" + apikey + "/" + key;
    return path;
  };

  var setItem = function(key, value){
    try{
      localStorage.setItem(makeStoragePath(key, ncmb.apikey), value);
    }catch(err){
      throw err;
    }
  };
  var getItem = function(key){
    try{
      return localStorage.getItem(makeStoragePath(key, ncmb.apikey));
    }catch(err){
      return null;
    }
  };
  var removeItem = function(key){
    try{
      return localStorage.removeItem(makeStoragePath(key, ncmb.apikey));
    }catch(err){
      return null;
    }
  };

  ncmb.collections[className] = User;
  return User;
};
