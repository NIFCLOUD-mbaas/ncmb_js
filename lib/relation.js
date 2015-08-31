"use strict";
var errors = require("./errors");

var Relation = module.exports = function(ncmb){
  function Relation(relatingClass){
    if(relatingClass === "user"){
      this.relatingClass = "/users";
    }else if(relatingClass === "role"){
      this.relatingClass = "/roles";
    }else if(relatingClass){
      this.relatingClass = "/classes/" + relatingClass;
    }
  }

  ["add", "remove"].forEach(function(method){
    var opName = method[0].toUpperCase() + method.substr(1) + "Relation";
    Relation.prototype[method] = function(object){
      if(this.__op !== opName){
        this.__op = opName;
        this.objects = [];
      }
      if(!Array.isArray(object)) object = [object];
      for (var i = 0, elem; elem = object[i]; i+=1) {
        pushToObjects(this, elem);
      }
      return this;
    };
  });

  var pushToObjects = function(relation, object){
    if(!object.className){
      throw new errors.InvalidArgumentError("Related object must be instance of ncmb providing classes.");
    }
    if(!relation.relatingClass){
        relation.relatingClass = object.className;
    }else if(relation.relatingClass !== object.className){
      throw new errors.DifferentClassError("Relation objects can be input just from instance of same class with first input.");
    }
    relation.objects.push(object);
  };

  ncmb.collections.Relation = Relation;
  return Relation;
};
