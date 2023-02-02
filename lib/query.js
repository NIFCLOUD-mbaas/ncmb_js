"use strict";

var qs = require("qs");
var Errors = require("./errors");

/**
* オブジェクトの検索を行うモジュールです。
*
* DataStore, User, Role, Fileクラスから呼び出し、それぞれのクラスメソッドとして利用します。
* 検索条件を設定するメソッドに続けてfetch/fetchAllをメソッドチェーンで実行して利用します。
*
* @class Query<T>
*/
var Query = module.exports = (function(){
  function Query(ncmb, className){
    this.__proto__.ncmb = ncmb;
    this._className = className;
    this._where  = {};
    this._limit  = 0;
    this._skip = 0;
  };

  /**
  * クエリを直接記述して設定します。
  *
  * @method Query<T>#where
  * @param {Object} where JSON形式のクエリオブジェクト
  * @return {this}
  */
  Query.prototype.where = function(where){
    if(typeof where !== "object")
      throw new Errors.InvalidWhereError("First argument must object.");
    for(var key in where){
      if(where.hasOwnProperty(key)){
        this._where[key] = where[key];
      }
    }
    return this;
  };

  /**
  * 指定したkeyの値がvalueと等しいオブジェクトを検索します。
  *
  * @method Query<T>#equalTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return {this}
  */
  Query.prototype.equalTo              = function(key, value){
    return setOperand(this, key, value);
  };

  /**
  * 指定したkeyの値がvalueと等しくないオブジェクトを検索します。
  *
  * @method Query<T>#notEqualTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return {this}
  */
  Query.prototype.notEqualTo           = function(key, value){
    return setOperand(this, key, value, "$ne");
  };

  /**
  * 指定したkeyの値がvalueより小さいオブジェクトを検索します。
  *
  * @method Query<T>#lessThan
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return {this}
  */
  Query.prototype.lessThan             = function(key, value){
    return setOperand(this, key, value, "$lt");
  };

  /**
  * 指定したkeyの値がvalue以下のオブジェクトを検索します。
  *
  * @method Query<T>#lessThanOrEqualTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return {this}
  */
  Query.prototype.lessThanOrEqualTo    = function(key, value){
    return setOperand(this, key, value, "$lte");
  };

  /**
  * 指定したkeyの値がvalueより大きいオブジェクトを検索します。
  *
  * @method Query<T>#greaterThan
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return {this}
  */
  Query.prototype.greaterThan          = function(key, value){
    return setOperand(this, key, value, "$gt");
  };

  /**
  * 指定したkeyの値がvalue以上のオブジェクトを検索します。
  *
  * @method Query<T>#greaterThanOrEqualTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return {this}
  */
  Query.prototype.greaterThanOrEqualTo = function(key, value){
    return setOperand(this, key, value, "$gte");
  };

  /**
  * 指定したkeyの値が、配列values内のいずれかと等しいオブジェクトを検索します
  *
  * @method Query<T>#in
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return {this}
  */
  Query.prototype.in                   = function(key, values){
    if(!Array.isArray(values)) throw new Errors.InvalidArgumentError();
    return setOperand(this, key, values, "$in");
  };

  /**
  * 指定したkeyの値が、配列values内のいずれとも等しくないオブジェクトを検索します。
  *
  * @method Query<T>#notIn
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return {this}
  */
  Query.prototype.notIn                = function(key, values){
    if(!Array.isArray(values)) throw new Errors.InvalidArgumentError();
    return setOperand(this, key, values, "$nin");
  };

  /**
  * 指定したキーに値が存在するオブジェクトを検索します。
  * existがtrue(false)の場合、指定したkeyに値が存在する(しない)オブジェクトを検索します。
  * 第二引数は省略可。省略時はtrueを指定した場合と同意となります。
  *
  * @method Query<T>#exists
  * @param {string} key 値を比較するキー
  * @param {boolean} exist true(false)を設定した場合、値が存在する（しない）オブジェクトを検索する。省略可能。
  * @return {this}
  */
  Query.prototype.exists               = function(key, exist){
    if(typeof exist === "undefined" ) exist = true;
    if(typeof exist !== "boolean") throw new Errors.InvalidArgumentError();
    return setOperand(this, key, exist, "$exists");
  };

  /**
  * 指定したkeyの値が正規表現regexに合致するオブジェクトを検索します。
  *
  * @method Query<T>#regularExpressionTo
  * @param {string} key 値を比較するキー
  * @param {string} regex 検索する正規表現
  * @return {this}
  */
  Query.prototype.regularExpressionTo  = function(key, regex){
    if(typeof regex !== "string") throw new Errors.InvalidArgumentError();
    return setOperand(this, key, regex, "$regex");
  };

  /**
  * 指定したkeyの値が、配列values内のいずれかと等しいオブジェクトを検索します
  *
  * @method Query<T>#inArray
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return {this}
  */
  Query.prototype.inArray              = function(key, values){
    if(!Array.isArray(values)) values = [values];
    return setOperand(this, key, values, "$inArray");
  };

  /**
  * 指定したkeyの値が、配列values内のいずれとも等しくないオブジェクトを検索します。
  *
  * @method Query<T>#notInArray
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return {this}
  */
  Query.prototype.notInArray           = function(key, values){
    if(!Array.isArray(values)) values = [values];
    return setOperand(this, key, values, "$ninArray");
  };

  /**
  * 指定したkeyの値が、配列values内のすべての値を含むオブジェクトを検索します。
  *
  * @method Query<T>#allInArray
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return {this}
  */
  Query.prototype.allInArray           = function(key, values){
    if(!Array.isArray(values)) values = [values];
    return setOperand(this, key, values, "$all");
  };

  /**
  * 指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method Query<T>#near
  * @param {string} key 値を比較するキー
  * @param {NCMB.GeoPoint} location 原点とする位置情報
  * @return {this}
  */
  Query.prototype.near  = function(key, location){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new this.ncmb.Errors.InvalidArgumentError("Second argument must be instance of ncmb.GeoPoint.");
    }
    return setOperand(this, key, location.toJSON(), "$nearSphere");
  };

  /**
  * 検索範囲内(Km)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method Query<T>#withinKilometers
  * @param {string} key 値を比較するキー
  * @param {NCMB.GeoPoint} location 原点とする位置情報
  * @param {number} maxDistance 原点からの検索範囲(Km)
  * @return {this}
  */
  Query.prototype.withinKilometers = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInKilometers"] = maxDistance;
    return this;
  };

  /**
  * 検索範囲内(ml)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method Query<T>#withinMiles
  * @param {string} key 値を比較するキー
  * @param {NCMB.GeoPoint} location 原点とする位置情報
  * @param {number} maxDistance 原点からの検索範囲(ml)
  * @return {this}
  */
  Query.prototype.withinMiles = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInMiles"] = maxDistance;
    return this;
  };

  /**
  * 検索範囲内(rad)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method Query<T>#withinRadians
  * @param {string} key 値を比較するキー
  * @param {NCMB.GeoPoint} location 原点とする位置情報
  * @param {number} maxDistance 原点からの検索範囲(rad)
  * @return {this}
  */
  Query.prototype.withinRadians = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInRadians"] = maxDistance;
    return this;
  };

  /**
  * 指定したキーの位置情報で、左下（southWestVertex）と右上（northEastVertex）の2地点からなる矩形（長方形）で設定された検索範囲の内部にあるオブジェクトを検索します。
  *
  * @method Query<T>#withinSquare
  * @param {string} key 値を比較するキー
  * @param {NCMB.GeoPoint} southWestVertex 検索矩形の左下の頂点
  * @param {NCMB.GeoPoint} northEastVertex 検索矩形の右下の頂点
  * @return {this}
  */
  Query.prototype.withinSquare = function(key, southWestVertex, northEastVertex){
    if(!(southWestVertex instanceof this.ncmb.GeoPoint) || !(northEastVertex instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    var box = {"$box":[southWestVertex.toJSON(), northEastVertex.toJSON()]};
    setOperand(this, key, box, "$within");
    return this;
  };

  /**
  * 複数の検索条件subqueriesを設定し、その検索結果のいずれかに合致するオブジェクトを検索します
  * 配列で複数の条件を一度に設定でき、複数回実行することで検索条件を追加できます。
  *
  * @method Query<T>#or
  * @param {Array<Query<T>>|Query<T>} subqueries 検索条件
  * @return {this}
  */
  Query.prototype.or = function(subqueries){
    if(!Array.isArray(subqueries)){
      subqueries = [subqueries];
    }
    this._where        = this._where        || {};
    this._where["$or"] = this._where["$or"] || [];
    for(var i = 0; i < subqueries.length; i++){
      if(!subqueries[i]._where) throw new Errors.InvalidArgumentError("Argument is invalid. Input query or array of query.");
      this._where["$or"].push(subqueries[i]._where);
    }
    return this;
  };

  /**
  * subqueriesの検索結果のうち、指定したsubkeyとkeyの値が一致するオブジェクトを検索します。
  *
  * @method Query<T>#select
  * @param {string} key メインクエリのクラスで値を比較するキー
  * @param {string} subkey サブクエリの検索結果で値を比較するキー
  * @param {Query} subquery 検索条件
  * @return {this}
  */
  Query.prototype.select = function(key, subkey, subquery){
    if(typeof key !== "string" || typeof subkey !== "string"){
      throw new Errors.InvalidArgumentError("Key and subkey must be string");
    }
    if(!subquery._className) throw new Errors.InvalidArgumentError("Third argument is invalid. Input query.");
    var className = null;
    if(subquery._className === "/users"){
      className = "user";
    }else if(subquery._className === "/roles"){
      className = "role";
    }else if(subquery._className === "/installations"){
      className = "installation";
    }else if(subquery._className === "/files"){
      className = "file";
    }else{
      className = subquery._className.slice(9);
    }
    this._where                 = this._where      || {};
    this._where[key]            = this._where[key] || {};
    if(subquery._limit > 0 && subquery._skip > 0){
      this._where[key]["$select"] = {query:{className: className, where: subquery._where, limit:subquery._limit, skip:subquery._skip} , key: subkey};
    }else if(subquery._limit > 0){
      this._where[key]["$select"] = {query:{className: className, where: subquery._where, limit:subquery._limit} , key: subkey};
    }else if(subquery._skip > 0){
      this._where[key]["$select"] = {query:{className: className, where: subquery._where, skip:subquery._skip} , key: subkey};
    }else{
      this._where[key]["$select"] = {query:{className: className, where: subquery._where} , key: subkey};
    }
    return this;
  };

  /**
  * objectのkeyのプロパティに関連づけられているリレーションの実態（オブジェクト）を検索します。
  * objectはmobile backend に保存済みである必要があります。
  *
  * @method Query<T>#relatedTo
  * @param object
  * @param {string} key オブジェクトが関連づけられているキー
  * @return {this}
  */
  Query.prototype.relatedTo = function(object, key){
    var className = null;
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(!object.className)       throw new Errors.InvalidArgumentError("First argument requires saved object.");
    if(!object.objectId){
      throw new Errors.NoObjectIdError("First argument requires saved object.");
    }
    if(object instanceof this.ncmb.User){
      className = "user";
    }else if(object instanceof this.ncmb.Role){
      className = "role";
    }else if(object instanceof this.ncmb.Installation){
      className = "installation";
    }else{
      className = object.className.slice(9);
    }
    this._where = this._where || {};
    this._where["$relatedTo"] = {object: {__type: "Pointer", className: className, objectId: object.objectId}, key: key};
    return this;
  };

  /**
  * subqueriesの検索結果のうち、指定したkeyに設定されているポインタの実態（オブジェクト）を検索します。
  * objectはmobile backend に保存済みである必要がある。
  *
  * @method Query<T>#inQuery
  * @param {string} key ポインタを保存したキー
  * @param {Query<T>} subquery 検索条件
  * @return {this}
  */
  Query.prototype.inQuery = function(key, subquery){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(!subquery._className)    throw new Errors.InvalidArgumentError("Second argument is invalid. Input query.");
    var className = null;
    if(subquery._className === "/users"){
      className = "user";
    }else if(subquery._className === "/roles"){
      className = "role";
    }else if(subquery._className === "/installations"){
      className = "installation";
    }else if(subquery._className === "/files"){
      className = "file";
    }else{
      className = subquery._className.slice(9);
    }
    this._where = this._where || {};
    this._where[key] = this._where[key] ||{};
    if(subquery._limit > 0 && subquery._skip > 0){
        this._where[key]["$inQuery"]= {where: subquery._where, className: className, limit:subquery._limit, skip:subquery._skip};
    }else if(subquery._limit > 0){
        this._where[key]["$inQuery"]= {where: subquery._where, className: className, limit:subquery._limit};
    }else if(subquery._skip > 0){
        this._where[key]["$inQuery"]= {where: subquery._where, className: className, skip:subquery._skip};
    }else{
        this._where[key]["$inQuery"]= {where: subquery._where, className: className};
    }
    return this;
  };

  /**
  * 指定したkeyに設定されているポインタの実態（オブジェクト）を検索し、返却値として返します。
  * 複数回実行した場合、最後に設定したキーが反映されます。複数のキーを指定することはできません。
  *
  * @method Query<T>#include
  * @param {string} key ポインタの中身を取得するキー
  * @return {this}
  */
  Query.prototype.include = function(key){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    this._include = key;
    return this;
  };

  /**
  * 検索結果の配列と共に、検索結果の総件数を取得するよう設定します。
  * 検索結果の配列は最大100件までしか取得しませんが、countは検索結果の総件数を表示します。
  * 検索結果配列にcountプロパティとして付加されます。
  *
  * @method Query<T>#count
  * @return {this}
  */
  Query.prototype.count = function(){
    this._count = 1;
    return this;
  };

  /**
  * 指定したkeyをソートして検索結果を取得するよう設定します。
  *（複数設定可能。先に指定したkeyが優先ソートされる。）
  * フラグによって降順ソートも可能です。降順フラグはキーごとに設定できます。
  *
  * @method Query<T>#order
  * @param {string} key ソートするキー
  * @param descending trueを指定した場合、降順でソートされる。省略可能。
  * @return {this}
  */
  Query.prototype.order = function(key, descending){
    var symbol = "";
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(descending && typeof descending !== "boolean"){
      throw new Errors.InvalidArgumentError("Second argument must be boolean.");
    }
    if(descending === true) symbol = "-";
    if(!this._order){
      this._order = symbol + key;
    }else{
      this._order = this._order + "," + symbol + key;
    }
    return this;
  };

  /**
  * 検索結果の最大取得数を設定します。設定値は1から1000まで、デフォルト値は100です。
  *
  * @method Query<T>#limit
  * @param {number} limit 最大取得件数
  * @return {this}
  */
  Query.prototype.limit = function(limit){
    if(typeof limit !== "number"){
      throw new Errors.InvalidLimitError("Limit must be number.");
    }
    if(limit < 1 || limit >1000){
      throw new Errors.InvalidLimitError("Limit must be renge of 1~1000.");
    }
    this._limit = limit;
    return this;
  };

  /**
  * 指定したskipの件数だけ頭から除いた検索結果を取得するよう設定します。
  *
  * @method Query<T>#skip
  * @param {number} skip 検索結果から除く件数
  * @return {this}
  */
  Query.prototype.skip = function(skip){
    if(typeof skip !== "number") throw new Errors.InvalidskipError("Skip must be number.");
    if(skip < 0) throw new Errors.InvalidskipError("Skip must be greater than 0.");
    this._skip = skip;
    return this;
  };

  /**
  * objectIdから一意のオブジェクトを取得します。
  *
  * @method Query<T>#fetchById
  * @param {string} id 取得したいオブジェクトのobjectId
  * @param {function} [callback] コールバック関数
  * @return {Promise<T>} オブジェクト
  */
  Query.prototype.fetchById = function(id, callback){
    var path = "/" + this.ncmb.version + this._className + "/" + id;
    var Klass = this.ncmb.collections[this._className];
    if(typeof Klass === "undefined"){
      return Promise.reject(new Error("no class definition `" + this._className +"`"));
    }

    return this.ncmb.request({
      path: path,
      method: "GET"
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      var object = new Klass(obj);
      if(object.acl) object.acl = new this.ncmb.Acl(object.acl);
      if(callback) return callback(null, object);
      return object;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 検索条件に合致するオブジェクトのうち、先頭の一つだけを取得します。
  *
  * @method Query<T>#fetch
  * @param {function} [callback] コールバック関数
  * @return {Promise<T>} 検索結果に合致したオブジェクト
  */
  Query.prototype.fetch = function(callback){
    this._limit = 1;
    return this.fetchAll().then(function(objects){
      if(!objects[0]){
        if(callback) return callback(null, {});
        return {};
      }
      if(callback) return callback(null, objects[0]);
      return objects[0];
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 検索条件に合致するオブジェクトをすべて取得します。
  *
  * @method Query<T>#fetchAll
  * @param {function} [callback] コールバック関数
  * @return {Promise<Array<T>>} 検索結果に合致したオブジェクトの配列
  */
  Query.prototype.fetchAll = function(callback){
    var path = "/" + this.ncmb.version + this._className;
    var opts = [];
    if(Object.keys(this._where).length !== 0) opts.push("where=" + JSON.stringify(this._where));
    if(this._limit)    opts.push("limit="   + this._limit);
    if(this._skip)     opts.push("skip="    + this._skip);
    if(this._count)    opts.push("count="   + this._count);
    if(this._include)  opts.push("include=" + this._include);
    if(this._order)    opts.push("order="   + this._order);

    var Klass = this.ncmb.collections[this._className];
    if(typeof Klass === "undefined"){
      return Promise.reject(new Error("no class definition `" + this._className +"`"));
    }
    return this.ncmb.request({
      path: path,
      method: "GET",
      query: qs.parse(opts.join("&"))
    }).then(function(data){
      var objects = null;
      try{
        objects = JSON.parse(data).results;
        objects = objects.map(function(obj){
          if(Klass.className === "/files") return obj;
          var object = new Klass(obj);
          if(object.acl) object.acl = new this.ncmb.Acl(object.acl);
          return object;
        }.bind(this));
        var parsedData = JSON.parse(data)
        if("count" in parsedData){
          objects.count = parsedData.count;
        }
      }catch(err){
        if(callback) return callback(err, null);
        throw err;
      }
      if(callback) return callback(null, objects);
      return objects;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  var setOperand = function(query, key, value, operand){
    if(typeof key !== "string"){
      throw new Errors.InvalidArgumentError("Key must be string.");
    }
    if(value instanceof Date) {
      value = {__type: "Date", iso: value.toJSON()};
    }
    if(operand === undefined){
      query._where      = query._where || {};
      query._where[key] = value;
      return query;
    }
    query._where               = query._where      || {};
    query._where[key]          = query._where[key] || {};
    query._where[key][operand] = value;
    return query;
  };
  return Query;
})();
