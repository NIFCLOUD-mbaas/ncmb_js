"use strict";
var objectAssign = require('object-assign');
var Errors       = require("./errors");
var Query        = require("./query");

var Push = module.exports = function(ncmb){
  var modifiables = [
    "deliveryTime", "immediateDeliveryFlag", "target", "searchCondition",
    "message", "userSettingValue", "deliveryExpirationDate",
    "deliveryExpirationTime", "action", "title", "dialog",
    "badgeIncrementFlag", "badgeSetting", "sound",
    "contentAvailable", "richUrl", "category", "acl"];
  var isModifiable = function(key){
    return modifiables.indexOf(key) > -1;
  }

  var reserved = ["send", "set", "update", "className"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  function Push(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }else{
          throw new ncmb.Errors.UnmodifiableVariableError(key + " cannot be set, it is reserved.");
        }
      }
    }
  };
  var className = Push.prototype.className = "/push";

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      Push[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });

  Push.prototype.send = function(callback){
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
      Object.keys(this).forEach(function (key) {
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));
      objectAssign(this, obj);
      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  Push.prototype.set = function(key, val){
    if(!key) return this;
    if(typeof val === "undefined" && typeof key === "object"){
      Object.keys(key).forEach(function(k){
        this.set(k, key[k]);
      }.bind(this));
    }else{
      if(isModifiable(key)){
        this[key] = val;
      }else{
        throw new ncmb.Errors.UnmodifiableVariableError(key + " の変更はできません");;
      }
    }
    return this;
  };

  ncmb.collections[className] = Push;
  return Push;
};
