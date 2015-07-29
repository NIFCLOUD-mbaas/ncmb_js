"use strict";

require("babel/polyfill");
var Url     = require("url");
var qs      = require("qs");
var request = require("superagent");

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

  var setPointer = function(object, key, className, objectId){
    if (className === "users") className = "user";
    if(className.indexOf("classes/") !== -1){
      className = className.slice(8);
    }
    object[key] = {__type: "Pointer", className: className, objectId: objectId};
  };

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
      var saveList = [];
      for(var key in data){
        if(data[key] === null){
          continue;
        }
        
        if (data[key] instanceof Date) {
          data[key] = {__type: "Date", iso: data[key].toJSON()};
          continue;
        }

        if(typeof data[key] !== "object" || !data[key].className || data[key].className === "/files" ){
          continue;
        }

        if(data[key].className === "/geolocation") {
          data[key] = data[key].toJSON();
          continue;
        }

        if(data[key].objectId){
          setPointer(data, key, data.key.className, data[key].objectId);
          continue;
        } 

        var element = {key: key, object: data[key]}
        saveList.push(element);
      }

      if(saveList.length === 0){
        r.send(data);
        r.end(_callback);
      }else{
        Promise.all(saveList.map(function(element){
          var obj = element.object;
          if(obj.className === "/users" ){
            return obj.signUpByAccount();
          }
          return obj.save();
        }))
        .then(function(response){
          for(var i = 0; i < saveList.length; i++){
            var obj = saveList[i].object;
            var key = saveList[i].key;
            setPointer(data, key, obj.className.slice(1), obj.objectId);
          }
          r.send(data);
          r.end(_callback);
        })
        .catch(function(err){
          return _callback(err, null);
        });
      }
    }else{
      if(typeof query == "object") r.query(query);
      r.end(_callback);
    }
  }.bind(this));
};
