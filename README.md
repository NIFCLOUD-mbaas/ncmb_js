JavaScript SDK for NiftyCloud mobile Backend as a Service
------------------------------------------------------------

## Install

```shell
$ npm install ncmb -S
```

## Getting Start

1. Create Account and create application.
2. Get API KEY / Client KEY
3. Write codes!

* DataStore

```javascript
var NCMB = NCMB || require("../lib/ncmb");
var ncmb = new NCMB("your_apikey", "your_clientkey");
// get data class
var Food = ncmb.DataStore("Food");
Food.where({name: "orange"}).limit(3).offset(1).fetchAll()
.then(function(foods){
  console.log(foods);
  foods[0].delete();
})
.catch(function(err){
  console.log(err);
});

var food = new Food({name: "apple"});
food.save()
.then(function(apple){
  console.log(apple);
})
.catch(function(err){
  console.log(err);
});
```
* Push

```javascript
var NCMB = NCMB || require("../lib/ncmb");
var ncmb = new NCMB();
ncmb.set("apikey", "<YOUR API KEY>")
    .set("clientkey", "<YOUR CLIENT KEY>");
var push = new ncmb.Push()
push.send()
.then(function(newPush){
  console.log(newPush);
})
.catch(function(err){
  console.log(err);
});

var users = ncmb.User.fetchAll()
.then(function(users){
  var pushes = users.map(function(user){
    // set <key, val> or object
    return new ncmb.Push().set("target", ["ios"])
      .set({title: "sample", dialog: true});
    // or
    // return new ncmb.Push({
    //   target: ["ios"],
    //   title:  "sample",
    //   dialog:  true
    // })
  });
  return Promise.map(pushes, function(push){ return push.send();});
})
.then(function(sentPushes){
  console.log(newPush);
})
.catch(function(err){
  console.log(err);
});
```

## Use in Browser

```
$ browserify -r ./lib/ncmb.js:ncmb >ncmb_latest.min.js
```

```javascript
<script src="js/ncmb_latest.min.js"></script>
<script>
  var NCMB = require("ncmb");
  var ncmb = new NCMB("your_apikey", "your_clientkey");
```


## For Developer

```shell
$ git clone XXX
$ cd javascript-sdk-mbaas
$ npm install
$ npm run stub:start
$ npm test
```
