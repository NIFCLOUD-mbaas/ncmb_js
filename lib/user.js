"use strict";

var Query        = require("./query");
var Operation    = require("./operation");
var Errors       = require("./errors");
var objectAssign = require("object-assign");
var ProviderUtil = require("./provider-util");
var localStorage = null;
if(typeof window !== "undefined"){
  if(window.localStorage){
    localStorage = window.localStorage;
  }else{
    localStorage = require("localforage");
  }
}else{
  localStorage = new require("node-localstorage").LocalStorage("./scratch");
}

var User = module.exports = function(ncmb){
  var reserved = [
    "className", "save",
    "update", "delete", "logout", "requestPasswordReset",
    "signUpByAccount", "signUpWith", "requestSignUpEmail",
    "login", "loginAsAnonymous", "loginWithMailAddress", "loginWith",
    "getCurrentUser", "isCurrentUser",
    "setIncrement", "add", "addUnique", "remove"];

  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  var unreplaceable =[
    "objectId", "password", "createDate", "updateDate", "mailAddressConfirm", "_id", "sessionToken"
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

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      User[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });
  Object.keys(Operation.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Operation.prototype[attr] === "function"){
      User.prototype[attr] = function(){
        var operation = new Operation(reserved);
        return operation[attr].apply(this, [].slice.apply(arguments));
      };
    }
  });

  User.getCurrentUser = function(){
    var currentUser = getItem(CURRENT_USER_PATH);
    if(currentUser){
      return ncmb.currentUser = JSON.parse(currentUser);
    }
    return null;
  };

  User.prototype.isCurrentUser = function(){
    if(this.sessionToken === ncmb.sessionToken) return true;
    return false;
  };

  User.prototype.signUpByAccount = User.prototype.save = function(callback){
    if (!this.userName){
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoUserNameError());
    }
    if (!this.password){
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoPasswordError());
    }

    return ncmb.request({
      path: "/" + ncmb.version + this.className,
      method: "POST",
      data: this
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

  User.prototype.signUpWith = function(provider, data, callback){
    if(this.userName){
      return ( callback || Promise.reject.bind(Promise))(new Errors.ContentsConflictError());
    }
    if(typeof provider === "function"){
      callback = provider;
      provider = null;
      data = null;
    }
    if(typeof data === "function"){
      callback = data;
      data = null;
    }
    if (!data && (!this.authData || Object.keys(this.authData).length !== 1)){
      return ( callback || Promise.reject.bind(Promise))(new Errors.InvalidAuthInfoError());
    }
    try {
      if(provider){ data = (function(){var _data = {}; _data[provider] = data; return _data;}());}
      provider = ProviderUtil.getProvider(this.authData || data);
    }catch(err){
      return ( callback || Promise.reject.bind(Promise))(err);
    }
    this.authData = this.authData || {};
    this.authData[provider.getName()] = this.authData[provider.getName()] || provider.getAuthData();
    return ncmb.request({
      path: "/" + ncmb.version + this.className,
      method: "POST",
      data: this
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

  User.prototype.requestPasswordReset = function(callback){
    if (! this.mailAddress) {
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoMailAddressError());
    }
    return ncmb.request({
      path: "/" + ncmb.version + "/requestPasswordReset",
      method: "POST",
      data: {'mailAddress': this.mailAddress }
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
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

  User.requestSignUpEmail = function(mailAddress,callback){
    if (! mailAddress) {
       return ( callback || Promise.reject.bind(Promise))(new Errors.NoMailAddressError());
    }
    return ncmb.request({
      path: "/" + ncmb.version + "/requestMailAddressUserEntry",
      method: "POST",
      data: {'mailAddress': mailAddress }
    }).then(function(data){
      if(callback) return callback(null, data);
      return data;
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
      path: "/" + ncmb.version + this.className + "/" + this.objectId,
      method: "PUT",
      data: replaceProperties
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

  User.prototype.delete = function(callback){
    if (!this.objectId) {
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError());
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

    return user.login().then(function(user){
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
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve(this);
    }
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
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.loginWithMailAddress = function(mailAddress, password, callback){
    var user = null;
    if(mailAddress instanceof ncmb.User){
      callback = password;
      user = mailAddress;
      mailAddress = user.mailAddress;
      password = user.password;
    }

    if(!mailAddress || !password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError());
    }
    if(!user){
      user = new User({mailAddress: mailAddress, password: password});
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.loginWithMailAddress().then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.prototype.loginWithMailAddress = function(callback){
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve(this);
    }
    if(!this.mailAddress || !this.password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError());
    }

    return ncmb.request({
      path: "/" + ncmb.version + "/login",
      method: "GET",
      query: {
        mailAddress: this.mailAddress,
        password: this.password
      }
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

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
    this.authData = {anonymous: {id: uuid}};

    return ncmb.request({
      path: "/" + ncmb.version + this.className,
      method: "POST",
      data: this
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key]
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.loginWith = function(provider, data, callback){
    var user = null;
    if(provider instanceof ncmb.User){
      user = provider;
      if(!user.authData){
        return ( callback || Promise.reject.bind(Promise))(new Errors.NoOAuthDataError());
      }
      if(Object.keys(user.authData).length === 1){
        if(typeof data === "function") callback = data;
        provider = null;
        data = null;
      }else{
        if(typeof data === "function"){
          callback = data;
          return ( callback || Promise.reject.bind(Promise))(new Errors.NoProviderInfoError());
        }else{
          provider = data;
          data = null;
        }
      }
    }else{
      user = new User();
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.loginWith(provider, data).then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.prototype.loginWith = function(provider, data, callback){
    if(typeof provider === "function"){
      callback = provider;
      provider = null;
      data = null;
    }
    if(typeof data === "function"){
      callback = data;
      data = null;
    }
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve(this);
    }
    try {
      var _data = null;
      if(provider){
        _data = {};
        if(data){
          _data[provider] = data;
          data = _data;
        }
      }
      provider = ProviderUtil.getProvider(data || this.authData, provider);
      if(Object.keys(this.authData || data).indexOf(provider.getName()) === -1){
        throw new Errors.InvalidProviderError();
      }
      if(data && data[provider.getName()]){
        _data = this.authData || data;
        Object.keys(_data[provider.getName()]).forEach(function(key){
          if(_data[provider.getName()][key] !== data[provider.getName()][key]){
            throw new Errors.InvalidOAuthDataError();
          }
        }.bind(this));
      }
    }catch(err){
      return ( callback || Promise.reject.bind(Promise))(err);
    }

    var oauthData = { authData: {}};
    oauthData.authData[provider.getName()] = provider.getAuthData();
    return ncmb.request({
      path: "/" + ncmb.version + "/users",
      method: "POST",
      data: oauthData
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  User.logout = function(callback){
    var user = new ncmb.User({sessionToken:ncmb.sessionToken});
    return user.logout(callback);
  };

  User.prototype.logout = function(callback){
    if(!this.sessionToken){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoSessionTokenError());
    }
    var currentSessionToken = ncmb.sessionToken;
    if(currentSessionToken !== this.sessionToken) ncmb.sessionToken = this.sessionToken;
    return ncmb.request({
      path: "/" + ncmb.version + "/logout",
      method: "GET"
    }).then(function(){
      if(currentSessionToken === this.sessionToken){
        removeItem(CURRENT_USER_PATH);
        ncmb.sessionToken = null;
      }else{
        ncmb.sessionToken = currentSessionToken;
      }
      this.sessionToken = null;
      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

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
