"use strict";

var Errors = require("./errors");

var Operation = module.exports = (function(){
  var reserved = [];
  function Operation(reservedWords){
    reserved = reservedWords;
  };
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  Operation.prototype.get = function(key){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    return this[key];
  };
  Operation.prototype.set = function(key, value){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(isReserved(key))         throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    this[key] = value;
    return this;
  };

  Operation.prototype.setIncrement = function(key, amount){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    }
    if(amount && typeof amount !== "number"){
      throw new Errors.InvalidArgumentError("Amount number must be inputed by number");
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
      throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    }
    if(!objects){
      throw new Error("objects are required");
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
      throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    }
    if(!objects){
      throw new Error("Objects are required.");
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
    if(isDuplicated) throw new Errors.DuplicatedInputError("Input objects are duplicated.");
    return this;
  };

  Operation.prototype.remove = function(key, objects){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError();
    }
    if(!objects){
      throw new Error("Objects are required.");
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
