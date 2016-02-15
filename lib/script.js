"use strict";


var Errors = require("./errors");

var Script = module.exports = function(ncmb){

  // 関数名, 関数外の変数名の予約
  var reserved = ["className", "exec"];
  var is Reserved = function(key){
    return reserved.indexOf(key) > -1;
  };
  //　書き換え不可な引数名の予約
  var unreplaceable = [
    "_id"
  ];

  function Script(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }else{
          throw new Errors.UnmodifiableVariableError(attr + " cannot be set, it is reserved.");
        }
      }
    }
  };
  var className = Script.prototype.className = "/script";

  Script.exec = function(callback){

    return ncmb.requestScript({
      // ここで必要な引数をrequestに渡す
      // 必要に応じてrequest側も書き換える

    }).then(function(res){
      // ここでresponseを分解したりする
      // 必要に応じてrequest側も書き換える

    }).catch(function(err){
      // 必要に応じて変更する
      if(callback) return callback(err, null);
      throw err;
    });
  };

  ncmb.collections[className] = Script;
  return Script;
};
