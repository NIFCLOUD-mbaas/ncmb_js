JavaScript SDK for NIFCLOUD mobile backend
------------------------------------------------------------
[![Build Status](https://travis-ci.org/NIFCLOUD-mbaas/ncmb_js.png)](https://travis-ci.org/NIFCLOUD-mbaas/ncmb_js)

This is JavaScript SDK for [NIFCLOUD mobile backend](https://mbaas.nifcloud.com/), a cloud based backend service for smartphone applications.
By importing SDK, the following functions can be used from the application.
- [Push notification](https://mbaas.nifcloud.com/doc/current/push/basic_usage_javascript.html)
- [User management](https://mbaas.nifcloud.com/doc/current/user/basic_usage_javascript.html)
- [SNS](https://mbaas.nifcloud.com/doc/current/sns/facebook_javascript.html)
- [Datastore](https://mbaas.nifcloud.com/doc/current/datastore/basic_usage_javascript.html)
- [Filestore](https://mbaas.nifcloud.com/doc/current/filestore/basic_usage_javascript.html)
- [Geo Location](https://mbaas.nifcloud.com/doc/current/geopoint/basic_usage_javascript.html)
- [Script](https://mbaas.nifcloud.com/doc/current/script/basic_usage_javascript.html)  

To use the API through SDK, you need to register to NIFCLOUD mobile backend.
For  SDK installation steps, see [Quick Start](https://mbaas.nifcloud.com/doc/current/introduction/quickstart_javascript.html).

## Supported environment

| Environment              | Supported version |
|:---                  |:---        |
| Node.js              | 14.x, 16.x, 18.x |
| Mozilla Firefox      | Latest version     |
| Google Chrome        | Latest version     |
 (※as of August, 2022)

Remember to turn on Allow Cookies on your browsers.

## Support desk coverage version

Please read [Developer guidelines](https://mbaas.nifcloud.com/doc/current/common/dev_guide.html#SDK%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6).

- v3.1.2 ～ (※as of August, 2022)

## Install

```shell
$ npm install ncmb -S
```

## Getting Start

1. Create Account and create application.
2. Get API KEY / Client KEY
3. Write codes!

* Initialize

```javascript
var NCMB = NCMB || require("../lib/ncmb");
var ncmb = new NCMB("your_apikey", "your_clientkey");
```

* DataStore

```javascript
// get data from ncmb
var Food = ncmb.DataStore("Food");
Food.equalTo("name", "orange")
    .limit(3)
    .skip(1)
    .fetchAll()
    .then(function(foods){
      console.log(foods);
      foods[0].delete();
    })
    .catch(function(err){
      console.log(err);
    });

// cerate instance and save into ncmb
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
// send push notification
var push = new ncmb.Push()
push.set("title", "Hello, NCMB!")
    .send()
    .then(function(newPush){
      console.log(newPush);
    })
    .catch(function(err){
      console.log(err);
    });

```
* User

```javascript
//get data
ncmb.User.fetchAll()
    .then(function(users){
      console.log(users[0]);
    })
    .catch(function(err){
      console.log(err);
    });

// signup and login
var user = new ncmb.User({userName:"Tarou", password:"1234"});
user.signUpByAccount()
    .then(function(user){
      return ncmb.User.login(user);
    })
    .then(function(user){
      console.log(user.isCurrentUser); //true
      return user.set("NickName", "taro")
                 .update();
    })
    .then(function(user){
      ncmb.User.logout(user);
    })
    .catch(function(err){
      console.log(err);
    });

```

* File

```javascript
// download binary data
ncmb.File.download()
    .then(function(data){
        console.log(data);
      })
    .catch(function(err){
      console.log(err);
    });

// upload file (Case of Node.js)
var fs = require('fs');
fs.readFile("/filepath/test.text", function(err, data){
  if(err) throw err;
  ncmb.File.upload("upload.text", data)
      .then(function(data){
          console.log(data);
        })
      .catch(function(err){
          console.log(err);
        });
});

```

* Role

```javascript
// get role and subroles
ncmb.Role.fetchAll()
    .then(function(roles){
      return roles[0].fetchRole();
    })
    .then(function(subroles){
      console.log(subroles);
    })
    .catch(function(err){
      console.log(err);
    });

//set member and subrole
var role = new ncmb.Role("roleName");
role.addUser([user1,user2])
    .addRole([role1,role2])
    .save()
    .then(function(role){
      console.log(role);
    })
    .catch(function(err){
      console.log(err);
    });

```

* acl

```javascript
// set acl
var acl = new ncmb.Acl();
acl.setPublicReadAccess(false)
   .setRoleReadAccess("admin", true);
var Food = ncmb.DataStore("Food");
var food = new Food({name:"orange", acl:acl});
food.save()
    .then(function(food){
      console.log(food)
    })
    .catch(function(err){
      onsole.log(err);
    });

// check acl
ncmb.Role.equalTo("roleName", "admin")
         .fetch()
         .then(function(role){
            console.log(role.acl.get("public", "read"));
          })
         .catch(function(err){
            console.log(err);
          });
```

* Relation

```javascript
//set relation
var relation = new ncmb.Relation();
var Food = ncmb.DataStore("Food");
var food = new Food({name:"orange"});
relation.add(food);
var user = new ncmb.User({userName:"Hanako", password:"password"});
user.login()
.then(function(user){
  user.set("foods", relation);
  return user.update();
})
.catch(function(err){
  console.log(err);
});

// get related object
Food.relatedTo(user, "foods")
    .fetchAll()
    .then(function(food){
      console.log(food);
    })
    .catch(function(err){
      console.log(err);
    });
```

* GeoPoint

```javascript
// set geopoint
var point = new ncmb.GeoPoint(35, 135);
var Country = ncmb.DataStore("Country");
var Japan = new Country();
Japan.set("location", point);
Japan.save()
     .then(function(data){
        console.log(data);
      })
     .catch(function(err){
        console.log(err);
      });

```


## Use in Browser

```
$ browserify -r -p licensify -t [ uglifyify -x .js ] -o ncmb.min.js lib/ncmb.js
```

```javascript
<script src="js/ncmb.min.js"></script>
<script>
  var ncmb = new NCMB("your_apikey", "your_clientkey");
  ...
</script>
```


## For Developer

```shell
$ git clone https://github.com/NIFCLOUD-mbaas/ncmb_js
$ cd ncmb_js
$ npm install
$ npm test
```

npm test is not working on default Windows OS environment.
If you want to do that, please setup nohup command.

## Automated Test On Frontend
1. Generate test files
```shell
$ npm run build                 # if library is updated, frontend test need to update ncmb.min.js
$ npm run test:frontend:modules # run only once at the first time
$ npm run test:frontend:prepare # generate test files at test/frontend/www
```
2. Make app on mBaaS
3. Change anonymous user flag from disable to enable in application setting page
4. Files exists as below after npm commands
5. Set Appkey and Secretkey in config.js
6. Run index.html on browser
7. Run application in Monaca (Upload files as below)

#### Directory Structure On Browser
```
(Any directory)/
 ├ index.html
 ├ ncmb.min.js
 ├ ncmb.test.full.js
 ├ config.js
 └css/
   └mocha.css
```

#### Directory Structure On Monaca
```
www/
 ├ index.html //overwrite
 ├ ncmb.min.js
 ├ ncmb.test.full.js
 ├ config.js
 └css/
   └mocha.css
```

## Create SDK Document

Run `npm run document:generate` command, then documents has created in `docs/` directory.

## Dependency
  Please refer to Dependencies part in package.json for details.

## References

- [ニフクラ mobile backend](https://mbaas.nifcloud.com/)
- [SDKの詳細な使い方](https://mbaas.nifcloud.com/doc/current/)
- [サンプル＆チュートリアル](https://mbaas.nifcloud.com/doc/current/tutorial/tutorial_javascript.html)
- [ユーザーコミュニティ](https://github.com/NIFCLOUD-mbaas/UserCommunity)

## License

Please read [LICENSE](https://github.com/NIFCLOUD-mbaas/ncmb_js/blob/master/LICENSE).
