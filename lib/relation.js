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

  Relation.prototype.add = function(object){
    if(this.__op !== "AddRelation"){
      this.__op = "AddRelation";
      this.objects = [];
    }
    if(Array.isArray(object)){
      if(!this.relatingClass){
        this.relatingClass = object[0].className;
      }
      for (var i = 0, elem; elem = object[i]; i+=1) {
        pushToObjects(this, elem);
      }
    }else{
      if(!this.relatingClass){
        this.relatingClass = object.className;
      }
      pushToObjects(this, object);
    }
    return this;
  };
  
  Relation.prototype.remove = function(object){
    if(this.__op !== "RemoveRelation"){
      this.__op = "RemoveRelation";
      this.objects = [];
    }
    if(Array.isArray(object)){
      if(!this.relatingClass){
        this.relatingClass = object[0].className;
      }
      for (var i = 0, elem; elem = object[i]; i+=1) {
        pushToObjects(this, elem);
      }
    }else{
      if(!this.relatingClass){
        this.relatingClass = object.className;
      }
      pushToObjects(this, object);
    }
    return this;
  };

  var pushToObjects = function(relation, object){
    if(!object.className){
      throw new errors.InvalidArgumentError();
    }else if(relation.relatingClass !== object.className){
      throw new errors.DifferentClassError();
    }
    relation.objects.push(object);
  };

  ncmb.collections.Relation = Relation;
  return Relation;
};
