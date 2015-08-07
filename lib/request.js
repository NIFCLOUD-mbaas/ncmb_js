"use strict";

require("babel/polyfill");
var Url     = require("url");
var qs      = require("qs");
var request = require("superagent");

var setPointer = function(object, key, className, objectId){
    if(className === "/users") className = "user";
    if(className.indexOf("/classes/") !== -1){
      className = className.slice(9);
    }
    object[key] = {__type: "Pointer", className: className, objectId: objectId};
    return object[key];
  };

  var presavePointerObjects = function(ncmb, data){
    var dataArray = [];
    for(var key in data){
      if(typeof data[key] !== "function"){
        var elem = {key: key, obj: data[key]};
        dataArray.push(elem);
      }
    }
    return Promise.all(dataArray.map(function(elem){
      var obj = elem.obj;
      var key = elem.key;

      if(obj === null) return null;
      if(obj instanceof Date) {
        data[key] = {__type: "Date", iso: obj.toJSON()};
        return data[key];
      }
      if(obj instanceof ncmb.GeoPoint) {
        data[key] = obj.toJSON();
        return data[key];
      }
      if(typeof obj !== "object" || !obj.className || obj.className === "/files" )
        return obj;

      if(obj.objectId)
        return setPointer(data, key, obj.className, obj.objectId);

      if(obj.className === "/users" ){
        return obj.signUpByAccount()
                  .then(function(res){
                    return setPointer(data, key, obj.className, obj.objectId);
                  })
                  .catch(function(err){
                    throw err;
                  });
      }
      return obj.save()
                .then(function(res){
                  return setPointer(data, key, obj.className, obj.objectId);
                })
                .catch(function(err){
                  throw err;
                });
    })).then(function(responses){
      return data;
    }).catch(function(err){
      throw err;
    });
  };

module.exports = function(opts, callback){
  if(typeof opts.path != "string") return callback(new Error("path required"), null);

  var path = opts.path;
  var timestamp = opts.timestamp || new Date().toISOString();
  var method = (opts.method || "GET").toUpperCase();

  var parsedUrl = Url.parse(path);
  parsedUrl.hostname = opts.fqdn || this.fqdn;
  parsedUrl.port     = opts.port || this.port;
  parsedUrl.protocol = opts.protocol || this.protocol;
  var url = parsedUrl.format();
  var query = opts.query;
  var data  = opts.data;
  var proxy = null;

  var sig = (this.createSignature || require("./signature").create)(
    parsedUrl.format(), method, opts.query || "", timestamp,
    opts.signatureMethod || this.signatureMethod,
    opts.signatureVersion || this.signatureVersion,
    opts.fqdn || this.fqdn,
    opts.apikey || this.apikey, opts.clientkey || this.clientkey
  );

  var headers = {
    "X-NCMB-Application-Key":    opts.apikey || this.apikey,
    "X-NCMB-Signature":          sig,
    "X-NCMB-Timestamp":          timestamp,
    "Content-Type":              "application/json",
    "X-NCMB-SDK-Version":        "javascript-2.0.0"
  };

  if(this.sessionToken) headers["X-NCMB-Apps-Session-Token"] = this.sessionToken;

  if(parsedUrl.protocol === "https:") var secureProtocol = "TLSv1_method";
  if(typeof (opts.proxy || this.proxy) === "undefined"){
    proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
  }

  return new Promise(function(resolve, reject){
    var _callback = function(err, res){
      if(err) return (callback && callback(err, null)) || reject(err);
      if(res.statusCode >= 400) return reject(res.error || new Error(res.text));
      return (callback && callback(null, res.text)) || resolve(res.text, res);
    };
    var r = request[method.toLowerCase()](url);
    Object.keys(headers).forEach(function(key){
      r.set(key, headers[key]);
    });
    if(typeof data == "object"){
      presavePointerObjects(this, data)
      .then(function(data){
        r.send(data);
        r.end(_callback);
      })
      .catch(function(err){
        return _callback(err, null);
      });
    }else{
      if(typeof query == "object") r.query(query);
      r.end(_callback);
    }
  }.bind(this));
};