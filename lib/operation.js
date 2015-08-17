"use strict";

// class method
var Operation = module.exports = (function(){
  var reserved = [];
  function Operation(reservedWords){
    reserved = reservedWords;
  };
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  Operation.prototype.get = function(key){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError();
    if(this[key] === null){
      return null;
    }else if(!this[key]){
      return undefined;
    }
    return this[key];
  }
  Operation.prototype.set = function(key, value){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError();
    if(isReserved(key))         throw new Errors.UnReplaceableKeyError();
    this[key] = value;
    return this;
  };

  Operation.prototype.setIncrement = function(key, amount){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError();
    }
    if(amount && typeof amount !== "number"){
      throw new Errors.InvalidArgumentError();
    }
    if(this[key] && this[key].__op === "Increment"){
      this[key].amount += amount || 1;
      return this;
    }
    this[key] = {__op: "Increment", amount: amount || 1};
    return this;
  };

  Operation.prototype.add = function(key, objects){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError();
    }
    if(!objects){
      throw new Error("objects is required");
    }
    if(!Array.isArray(objects)){
      objects = [objects];
    }
    if(this[key] && this[key].__op === "Add"){
      for(var i in objects){
        this[key].objects.push(objects[i]);
      }
      return this;
    }
    this[key] = {__op: "Add", objects: objects};
    return this;
  };

  Operation.prototype.addUnique = function(key, objects){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError();
    }
    if(!objects){
      throw new Error("objects is required");
    }
    if(!Array.isArray(objects)){
      objects = [objects];
    }
    if(!this[key] || this[key].__op !== "AddUnique"){
      this[key] = {__op: "AddUnique",objects:[]};
    }
    var checkUnique = new Set(this[key].objects);
    var isDuplicated = false;
    for(var i in objects){
      if(checkUnique.has(objects[i])){
        isDuplicated = true;
        continue;
      }
      this[key].objects.push(objects[i]);
      checkUnique.add(objects[i]);
    }
    if(isDuplicated) throw new Errors.DuplicatedInputError();
    return this;
  };

  Operation.prototype.remove = function(key, objects){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError();
    }
    if(!objects){
      throw new Error("objects is required");
    }
    if(!Array.isArray(objects)){
      objects = [objects];
    }
    if(this[key] && this[key].__op === "Remove"){
      for(var i in objects){
        this[key].objects.push(objects[i]);
      }
      return this;
    }
    this[key] = {__op: "Remove", objects: objects};
    return this;
  };
  return Operation;
})();
