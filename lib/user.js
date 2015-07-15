"use strict";

var Query = require("./query");
var Errors = require("./errors");

var LocalStorage = null;
var localStorage = null;

if(typeof window !== "undefined"){
  localStorage = require("localForage");
}else{
  LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var User = module.exports = function(ncmb){
  var reserved = [
    "save", "update", "delete", "login", "logout",
    "className", "mailAddressConfirm", "requestPasswordReset"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  }

  var unreplaceable =[
    "objectId", "password", "createDate", "updateDate", "mailAddressConfirm", "_id"
  ];

  var isReplaceable = function(key){
    if(unreplaceable.indexOf(key) === -1) return true;
    return false;
  }

  var CURRENT_USER_PATH = "currentUser";
  var SESSION_TOKEN_PATH = "sessionToken";

  function User(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }
      }
    }
    var currentUser = null;
    var sessionToken = null;
    if((currentUser = getItem(CURRENT_USER_PATH)) && (sessionToken = getItem(SESSION_TOKEN_PATH))){
      ncmb.currentUser = currentUser;
      ncmb.sessionToken = sessionToken;
    }
  }
  var className = User.prototype.className = "/users";

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
    var isUsingInstance = false;
    if(userName instanceof ncmb.User ){
      callback = password;
      isUsingInstance = true;
    }
    var bodyobj = {};
    if(isUsingInstance){
      if(!userName.userName || ! userName.password){
        return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError());
      }
      bodyobj.userName = userName.userName;
      bodyobj.password = userName.password;
    }else{
      if(typeof password === "function"){
        callback = password;
        return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError());
      }
      if(!userName || !password ){
        return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError());
      }
      bodyobj.userName = userName;
      bodyobj.password = password;
    }
   
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
      if(isUsingInstance) userName.objectId = obj.objectId;
      try{
        setLoginData(obj.objectId, obj.sessionToken);
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

  var setLoginData = function(currentUser, sessionToken){
    try{
      ncmb.currentUser = currentUser;
      ncmb.sessionToken = sessionToken;
      setItem(CURRENT_USER_PATH, currentUser);
      setItem(SESSION_TOKEN_PATH, sessionToken);
    }catch(err){
      throw err;
    };
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
