"use strict";

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

  function Push(options){
    this.set(options);
  };
  var className = User.prototype.className = "/push";

  Push.prototype.ncmb = ncmb;
  Push.prototype.send = function(callback){
    var path = "/" + this.ncmb.version + this.className;
    var opts = this;

    return this.ncmb.request({
      path:   path,
      method: "POST",
      data:   this
    }, callback).then(function(data){
      try{
        var object = JSON.parse(data)
      }catch(err){
        if(callback) return callback(err, null);
        throw err;
      }
      if(callback) return callback(null, object);
      return object;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    })
  };
  Push.prototype.set = function(key, val){
    if(typeof key === "undefined") return this;
    if(typeof val === "undefined" && typeof key === "object"){
      Object.keys(key).forEach(function(k){
        this.set(k, key[k]);
      }.bind(this));
    }else{
      if(isModifiable(key)){
        this[key] = val;
      }else{
        throw new this.ncmb.Errors.UnmodifiableVariableError(key + " の変更はできません");;
      }
    }
    return this;
  };

  return Push;
};
