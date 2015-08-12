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
    return setRelation(this, object, "AddRelation");
  };

  Relation.prototype.remove = function(object){
    return setRelation(this, object, "RemoveRelation");
  };

  var setRelation = function(relation, object, type){
    if(relation.__op !== type){
      relation.__op = type;
      relation.objects = [];
    }
    if(Array.isArray(object)){
      for (var i = 0, elem; elem = object[i]; i+=1) {
        pushToObjects(relation, elem);
      }
    }else{
      pushToObjects(relation, object);
    }
    return relation;
  };

  var pushToObjects = function(relation, object){
    if(!object.className) throw new errors.InvalidArgumentError();
    if(!relation.relatingClass){
        relation.relatingClass = object.className;
    }else if(relation.relatingClass !== object.className){
      throw new errors.DifferentClassError();
    }
    relation.objects.push(object);
  };

  ncmb.collections.Relation = Relation;
  return Relation;
};
