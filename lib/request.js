"use strict";

var Url     = require("url");
var qs      = require("querystring");
var Promise = require("bluebird");
var request = require("request");

module.exports = function(opts, callback){
  if(typeof opts.path != "string") return callback(new Error("path required"), null);

  var path = opts.path;
  var timestamp = opts.timestamp || new Date().toISOString();
  var method = (opts.method || "GET").toUpperCase();

  var parsedUrl = Url.parse(path);
  parsedUrl.hostname = opts.fqdn || this.fqdn;
  parsedUrl.port     = opts.port || this.port;
  parsedUrl.protocol = opts.protocol || this.protocol;

  if(method !== "POST" && method !== "PUT"){
    if(qs.stringify(opts.data) !== ""){
      parsedUrl.search = "?" + qs.stringify(opts.data);
    }
  }

  var sig = (this.createSignature || require("./signature").create)(
    parsedUrl.format(), method, opts.data || {}, timestamp,
    opts.signatureMethod || this.signatureMethod,
    opts.signatureVersion || this.signatureVersion,
    opts.fqdn || this.fqdn,
    opts.apikey || this.apikey, opts.clientkey || this.clientkey
  );

  var options = {
    url:   parsedUrl.format(),
    data:  opts.data || "",
    headers: {
      "X-NCMB-Application-Key":    opts.apikey || this.apikey,
      "X-NCMB-Signature":          sig,
      "X-NCMB-Timestamp":          timestamp,
      "Content-Type":              "application/json"
    }
  };
  if(parsedUrl.protocol === "https:") options.secureProtocol = "TLSv1_method";
  if(typeof (opts.proxy || this.proxy) === "undefined"){
    options.proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
  }
  return new Promise(function(resolve, reject){
    callback = callback || function(err, res, body){
      if(err) return reject(err);
      if(res.statusCode >= 400) return reject(body);
      return resolve(body);
    };
    var r = request[method.toLowerCase()](options, callback);
  }.bind(this));
};
