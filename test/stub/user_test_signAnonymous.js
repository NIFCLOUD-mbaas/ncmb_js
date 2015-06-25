//var config   = require("config");
//var expect   = require("chai").expect;

var NCMB = require("../ncmb_js/lib/ncmb");

var ncmb = new NCMB();
ncmb
.set("apikey", "e0372910f522cd1696f0c01f00dc7e53318e664657445316a063388ce3a14d18")
.set("clientkey", "678f362f2c11de56654b67d43941e5dfba280378d6baa2342da4d52411201a08")
.set("protocol", "https:")
.set("fqdn", "mb.api.cloud.nifty.com")
.set("port", 443);

//var user = new ncmb.User({userName: "testt", password: "aaa"});
//console.log(user);
ncmb.User.signUpByAnonymous()
.then(function(data){
  console.log("data:");
  console.log(data);
}).catch(function(err){
  console.log(err);
});



