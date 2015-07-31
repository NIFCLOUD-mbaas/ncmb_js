"use strict";
var errors = require("./errors");

var Relation = module.exports = function(ncmb){
  function Relation(addableClass){
    if(addableClass === "user"){
      addableClass = "/users";
    }else if(addableClass === "role"){
      addableClass = "/roles";
    }else{
      addableClass = "/classes/" + addableClass;
    }
    this.addableClass = addableClass;
  }

  var className = Relation.prototype.className = "/relation";

  Relation.prototype.add = function(object){
    if(this.__op !== "AddRelation"){
      this.__op = "AddRelation";
      this.objects = [];
    }
    if(object instanceof Array){
      for (var i = 0, elem; elem = object[i]; i+=1) {
        pushToObjects(this, elem);
      }
    }else{
      pushToObjects(this, object);
    }
    return this;
  };
  
  Relation.prototype.remove = function(object){
    if(this.__op !== "RemoveRelation"){
      this.__op = "RemoveRelation";
      this.objects = [];
    }
    if(object instanceof Array){
      for (var i = 0, elem; elem = object[i]; i+=1) {
        pushToObjects(this, elem);
      }
    }else{
      pushToObjects(this, object);
    }
    return this;
  };

  Relation.prototype.saveElements = function(callback){
    var saveList = [];
    for (var i = 0, elem; elem = this.objects[i]; i+=1) {
      if(this.objects[i].objectId){
        setPointer(this.objects, i, this.addableClass.slice(1), elem.objectId);
        continue;
      }
      saveList.push({key: i, object: elem});
    }
    if(saveList.length === 0){
      delete this.addableClass;
      if(callback) return callback(null, this);
      return this;
    }

    return Promise.all(saveList.map(function(element){
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
        setPointer(this.objects, key, this.addableClass.slice(1), obj.objectId);
      }
      delete this.addableClass;
      if(callback) return callback(null, this);
      return this;
    }.bind(this))
    .catch(function(err){
      if(callback) callback(err, null);
      throw err;
    });
  }

  var pushToObjects = function(relation, object){
    if(!object.className){
      throw new errors.InvalidArgumentError();
    }else if(relation.addableClass !== object.className){
      throw new errors.DifferentClassError();
    }
    relation.objects.push(object);
  };

  var setPointer = function(object, key, className, objectId){
    if (className === "users") className = "user";
    if(className.indexOf("classes/") !== -1){
      className = className.slice(8);
    }
    object[key] = {__type: "Pointer", className: className, objectId: objectId};
  };

  ncmb.collections.Relation = Relation;
  return Relation;
};
