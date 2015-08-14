"use strict";

// class method
var Operation = module.exports = (function(){
  var reserved = [];
  var obj = {};
  function Operation(reservedWords, object){
    reserved = reservedWords;
    obj = object;
  };
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  Operation.prototype.setIncrement = function(key, amount){
    console.log("key:",key);
    console.log("amount:",amount);
    console.log("obj:",obj);
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError();
    }
    if(amount && typeof amount !== "number"){
      throw new Errors.InvalidArgumentError();
    }
    if(obj[key] && obj[key].__op === "Increment"){
      obj[key].amount += amount || 1;
      return obj;
    }
    obj[key] = {__op: "Increment", amount: amount || 1};
    return obj;
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
    if(obj[key] && obj[key].__op === "Add"){
      for(var i in objects){
        obj[key].objects.push(objects[i]);
      }
      return obj;
    }
    obj[key] = {__op: "Add", objects: objects};
    return obj;
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
    if(!obj[key] || obj[key].__op !== "AddUnique"){
      obj[key] = {__op: "AddUnique",objects:[]};
    }
    var checkUnique = new Set(obj[key].objects);
    var isDuplicated = false;
    for(var i in objects){
      if(checkUnique.has(objects[i])){
        isDuplicated = true;
        continue;
      }
      obj[key].objects.push(objects[i]);
      checkUnique.add(objects[i]);
    }
    if(isDuplicated) throw new Errors.DuplicatedInputError();
    return obj;
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
    if(obj[key] && obj[key].__op === "Remove"){
      for(var i in objects){
        obj[key].objects.push(objects[i]);
      }
      return obj;
    }
    obj[key] = {__op: "Remove", objects: objects};
    return obj;
  };
  return Operation;
})();
