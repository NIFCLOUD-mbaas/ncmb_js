"use strict";

var Errors = require("./errors");
var Query = require("./query");
var fs = require("fs");

var File = module.exports = function(ncmb){
  var className = File.className = "/files";

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      File[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });

  File.upload = function(fileName, fileData, acl, callback){
    if (typeof acl === "function" ){
      callback = acl;
      acl = undefined;
    }

    if(!fileName){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoFileNameError());
    };
    if(!fileData){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoFileDataError());
    };

    return ncmb.request({
      path: "/" + ncmb.version + this.className + "/" + fileName,
      method: "POST",
      file: { fileName: fileName, fileData: fileData, acl: acl },
      contentType: "multipart/form-data"
    })
    .then(function(data){
      if(callback) return callback(null, data);
      return data;
    }.bind(this)).catch(function(err){
      if (callback) return callback(err, null);
      throw err;
    });
  };

  File.download = function(fileName, callback){
    if(! fileName){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoFileNameError());
    };
    return ncmb.request({
      path: "/" + ncmb.version + className + "/" + fileName,
      method: "GET"
    }).then(function(data){
      if(callback) return callback(null, data);
      return data;
    }.bind(this)).catch(function(err){
      if (callback) return callback(err, null);
      throw err;
    });
  };

  File.updateACL = function(fileName, acl, callback){
    if(! fileName){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoFileNameError());
    };
    if(! acl){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoACLError());
    };
    return ncmb.request({
      path: "/" + ncmb.version + className + "/" + fileName,
      method: "PUT",
      data: acl
    }).then(function(data){
       try{
        var obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      
      if(callback) return callback(null, obj);
      return obj;
    }.bind(this)).catch(function(err){
      if (callback) return callback(err, null);
      throw err;
    });
  };

  File.delete = function(fileName, callback){
    if(!fileName){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoFileNameError());
    };
    return ncmb.request({
      path: "/" + ncmb.version + className + "/" + fileName,
      method: "DEL"
    }).then(function(){
      if(callback) return callback(null);
      return;
    }).catch(function(err){
      if (callback) return callback(err);
      throw err;
    });
  };

  ncmb.collections[className] = File;
  return File;
};
