"use strict";

require('idempotent-babel-polyfill');

var Url     = require("url");
var qs      = require("qs");
var request = require("superagent");
var requestProxy = require('superagent-proxy');

module.exports = function(opts, callback){
  if(typeof opts.path != "string"){
    return callback(new Error("Path is required."), null);
  }

  var path = opts.path;
  var timestamp = opts.timestamp || new Date().toISOString();
  var method = (opts.method || "GET").toUpperCase();
  if(method === "DELETE") method = "DEL";

  var parsedUrl = Url.parse(path);
  parsedUrl.hostname = opts.scriptFqdn || this.scriptFqdn;
  parsedUrl.port     = opts.port || this.port;
  parsedUrl.protocol = opts.protocol || this.protocol;
  var url            = parsedUrl.format();
  var data           = opts.data;
  var query          = opts.query;
  var optionalHeader = opts.header;

  var queryString = method === "GET" ? query : {};
  var sig = (this.createSignature || require("./signature").create)(
    parsedUrl.format(), method, queryString || "", timestamp,
    opts.signatureMethod || this.signatureMethod,
    opts.signatureVersion || this.signatureVersion,
    opts.scriptFqdn || this.scriptFqdn,
    opts.apikey || this.apikey, opts.clientkey || this.clientkey
  );
  var acceptedContents = ["text/plain"];

  var baseHeaders = {
    "accept":                 acceptedContents,
    "X-NCMB-Application-Key": opts.apikey || this.apikey,
    "X-NCMB-Signature":       sig,
    "X-NCMB-Timestamp":       timestamp,
    "Content-Type":           opts.contentType || "application/json",
    "X-NCMB-SDK-Version":     "javascript-3.0.1"
  };

  if(this.sessionToken) baseHeaders["X-NCMB-Apps-Session-Token"] = this.sessionToken;

  if(parsedUrl.protocol === "https:") var secureProtocol = "TLSv1_method";

  return new Promise(function(resolve, reject){
    var _callback = function(err, res){
      if(err) return (callback && callback(err, null)) || reject(err);
      if(res.statusCode >= 400 || res.status >= 400) return reject(res.error || new Error(res.text));
      return (callback && callback(null, res.text)) || resolve(res.text, res);
    };
    var r = request[method.toLowerCase()](url);

    if(data)           r.send(data);
    if(query)          r.query(query);
    if(optionalHeader) r.set(optionalHeader);

    r.set(baseHeaders);

    var proxy = this.proxy || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
    if(requestProxy && proxy){
      requestProxy(request);
      r.proxy(proxy);
      r.set({host: this.scriptFqdn});
    }

    r.end(_callback);
  }.bind(this));
};
