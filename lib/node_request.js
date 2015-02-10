"use strict";

var request = require("request");
var assign  = require("object-assign");

var Request = module.exports = (function(){
  var url, method = "GET", proxy, headers = {"user-agent": "node_request"}, query, body, options;
  function Request(){
  };
  Request.get = function(_url){
    url = _url;
    return this;
  };
  Request.post = function(_url){
    method = "POST";
    url = _url;
    return this;
  };
  Request.set = function(key, val){
    headers[key] = val;
    return this;
  };
  Request.proxy = function(_proxy){
    proxy = _proxy;
    return this;
  };
  Request.query = function(_query){
    query = _query;
    return this;
  };
  Request.send = function(_body){
    body = _body;
    return this;
  };
  Request.options = function(_options){
    options = _options;
    return this;
  };
  Request.end = function(callback){
    console.log(1);
    var _options = assign({}, options);
    _options.url = url;
    _options.headers = headers;
    if(proxy) _options.proxy = proxy;
    _options.data = query || body;

    request[method](options, function(error, res, body){
      callback({error: error, body: res.body});
    });
  };
  return Request;
})();
