"use strict";

var request = require("superagent");
var Promise = require("bluebird");

var reserved = ["users", "roles", "acls"];
var NCMB = module.exports = (function(){
  function NCMB (config){
    // config.colName.
    //   if(reserved.indexOf(colName) > -1) throw new Error("予約語さわんな");
    var collections = config.collections || {};
    collections.users = {};
    collections.roles = {};
    collections.acls  = {};


    Object.keys(config.collections).forEach(function(colName){

      var wrap = function(object){
        object.__proto__.remove = function(){
          return new Promise(function(resolve, reject){
            request.del("http://localhost:8080/" + colName)
              .query(this)
              .end(function(err, res){
                if(err) return reject(err);
                return resolve(res.body);
              });
          });
        };
        object.__proto__.save = function(diff){
          return new Promise(function(resolve, reject){
            request.put("http://localhost:8080/" + colName)
              .send(this)
              .end(function(err, res){
                if(err) return reject(err);
                return resolve(res.body);
              });
          });
        };
        return object;
      };

      this[colName] = {
        find: function(where, fields){
          return new Promise(function(resolve, reject){
            this.where = where;
            this.fields = fields;

            request.get("http://localhost:8080/items")
              .query({
                where: this.where,
                fields: this.fields,
                limit: this._limit,
                skip: this._skip
              })
              .end(function(err, res){
                var data = res.body;
                if(Array.isArray(data)){
                  data = data.map(wrap);
                }else{
                  data = wrap(data);
                }
                if(err) return reject(err);
                return resolve(data);
              });
          }.bind(this));
        },
        findOne: function(where, fields){
          this._skip = 0;
          this._limit = 1;
          return this.find(where, fields);
        },
        limit: function(limit){
          this._limit = limit;
          return this;
        },
        skip: function(skip){
          this._skip = skip;
          return this;
        },

        insert: function(data){
          return new Promise(function(resolve, reject){
            request.post("http://localhost:8080/items")
              .send(data)
              .end(function(err, res){
                var data = res.body;
                if(Array.isArray(data)){
                  data = data.map(wrap);
                }else{
                  data = wrap(data);
                }

                if(err) return reject(err);
                return resolve(data);
              });
          });
        }
      };
      // this.users....;
      // this.roles....;
      // this.alcs.....;

    }.bind(this));
  }

  return NCMB;
})();
