// Type definitions for ncmb 3.1
// Project: https://mbaas.nifcloud.com/
// Definitions by: Atsushi Nakatsugawa <https://github.com/DefinitelyTyped>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
* すべてのNCMBクラスおよびメソッドを定義します。
*/
export default class NCMB {
  appKey: string;
  cliKey: string;
  /**
   * コンストラクターです。
   * 
   * @param {string} appKey アプリケーションキー。必須
   * @param {string} cliKey クライアントキー。必須
   * @param {Object} [config] 通信設定。省略可能
  */
  constructor(appKey: string, cliKey: string, config?: object);
  
  Acl: typeof Acl;
  DataStore(className: string): typeof DataStore;
  File: typeof File;
  User: typeof User;
  Script: typeof Script;
  GeoPoint: typeof GeoPoint;
  Installation: typeof Installation;
  Role: typeof Role;
  Push: typeof Push;
  Relation: typeof Relation;
}

type SearchCondition = {
  [key: string]: any;
}

/**
* データストアへの入出力について扱うクラスです。
* ※注意：
* ２種類のメソッド（インスタンスメソッド Instance method とスタティックメソッド Static method）があります。
* それぞれリファレンス上の表記と利用時のメソッドが異なりますので、下記を参考にご利用ください。
*
*   - リファレンス上の表記が「NCMB.DataStore#メソッド名」: インスタンスメソッド Instance method
*      - 利用例）NCMB.DataStore#save
*        ```
*        var GameScore = ncmb.DataStore("GameScore");
*        var gameScore = new GameScore();
*        gameScore.set("score", 1337)
*                 .save()
*        ```
*   - リファレンス上の表記が「NCMB.DataStoreConstructor#メソッド名」: スタティックメソッド Static method
*      - DataStoreの場合は、お客様に提供するスタティックメソッドはクエリQueryのみになります。
*/
export class DataStore extends Object {
  /**
  * クエリを直接記述して設定します。
  *
  * @param Object where JSON形式のクエリオブジェクト
  * @return this
  */
  static where(where: SearchCondition): typeof this;
  /**
  * 指定したkeyの値がvalueと等しいオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  static equalTo(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値がvalueと等しくないオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  static notEqualTo(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値がvalueより小さいオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  static lessThan(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値がvalue以下のオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  static lessThanOrEqualTo(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値がvalueより大きいオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  static greaterThan(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値がvalue以上のオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  static greaterThanOrEqualTo(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値が、配列values内のいずれかと等しいオブジェクトを検索します
  *
  * @param string key 値を比較するキー
  * @param Array values 比較する値
  * @return this
  */
  static in(key: string, values: any[]): typeof this;
  /**
  * 指定したkeyの値が、配列values内のいずれとも等しくないオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param Array values 比較する値
  * @return this
  */
  static notIn(key: string, values: any[]): typeof this;
  /**
  * 指定したキーに値が存在するオブジェクトを検索します。
  * existがtrue(false)の場合、指定したkeyに値が存在する(しない)オブジェクトを検索します。
  * 第二引数は省略可。省略時はtrueを指定した場合と同意となります。
  *
  * @param string key 値を比較するキー
  * @param boolean exist true(false)を設定した場合、値が存在する（しない）オブジェクトを検索する。省略可能。
  * @return this
  */
  static exists(key: string, exist: boolean): typeof this;
  /**
  * 指定したkeyの値が正規表現regexに合致するオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param string regex 検索する正規表現
  * @return DataStore
  */
  static regularExpressionTo(key: string, regex: string): typeof this;
  /**
  * 指定したkeyの値が、配列values内のいずれかと等しいオブジェクトを検索します
  *
  * @param string key 値を比較するキー
  * @param Array values 比較する値
  * @return this
  */
  static inArray(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値が、配列values内のいずれとも等しくないオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param Array values 比較する値
  * @return this
  */
  static notInArray(key: string, value: any): typeof this;
  /**
  * 指定したkeyの値が、配列values内のすべての値を含むオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param Array values 比較する値
  * @return this
  */
  static allInArray(key: string, value: any): typeof this;
  /**
  * 指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param GeoPoint location 原点とする位置情報
  * @return this
  */
  static near(key: string, location: GeoPoint): typeof this;

  /**
  * 検索範囲内(Km)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param GeoPoint location 原点とする位置情報
  * @param number maxDistance 原点からの検索範囲(Km)
  * @return this
  */
  static withinKilometers(key: string, location: GeoPoint, maxDistance: number): typeof this;
  /**
  * 検索範囲内(ml)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @param string key 値を比較するキー
  * @param GeoPoint location 原点とする位置情報
  * @param number maxDistance 原点からの検索範囲(ml)
  * @return this
  */
  static withinMiles(key: string, location: GeoPoint, maxDistance: number): typeof this;

  /**
  * 検索範囲内(rad)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method DataStore<T>#withinRadians
  * @param {string} key 値を比較するキー
  * @param {NCMB.GeoPoint} location 原点とする位置情報
  * @param {number} maxDistance 原点からの検索範囲(rad)
  * @return this
  */
  static withinRadians(key: string, location: GeoPoint, maxDistance: number): typeof this;
  
  /**
  * 指定したキーの位置情報で、左下（southWestVertex）と右上（northEastVertex）の2地点からなる矩形（長方形）で設定された検索範囲の内部にあるオブジェクトを検索します。
  *
  * @method DataStore<T>#withinSquare
  * @param {string} key 値を比較するキー
  * @param {NCMB.GeoPoint} southWestVertex 検索矩形の左下の頂点
  * @param {NCMB.GeoPoint} northEastVertex 検索矩形の右下の頂点
  * @return this
  */
  static withinSquare(key: string, southWestVertex: GeoPoint, northEastVertex: GeoPoint): typeof this;
  
  /**
  * 複数の検索条件subqueriesを設定し、その検索結果のいずれかに合致するオブジェクトを検索します
  * 配列で複数の条件を一度に設定でき、複数回実行することで検索条件を追加できます。
  *
  * @method DataStore<T>#or
  * @param {Array<DataStore<T>>|DataStore<T>} subqueries 検索条件
  * @return this
  */
  static or(subqueries: Array<typeof DataStore> | typeof DataStore): typeof this;
  
  /**
  * subqueriesの検索結果のうち、指定したsubkeyとkeyの値が一致するオブジェクトを検索します。
  *
  * @method DataStore<T>#select
  * @param {string} key メインクエリのクラスで値を比較するキー
  * @param {string} subkey サブクエリの検索結果で値を比較するキー
  * @param {Query} subquery 検索条件
  * @return this
  */
  static select(key: string, subkey: string, subquery: typeof DataStore): typeof this;
  
  /**
  * objectのkeyのプロパティに関連づけられているリレーションの実態（オブジェクト）を検索します。
  * objectはmobile backend に保存済みである必要があります。
  *
  * @method DataStore<T>#relatedTo
  * @param object
  * @param {string} key オブジェクトが関連づけられているキー
  * @return this
  */
  static relatedTo(object: DataStore, key: string): typeof this;

  /**
  * subqueriesの検索結果のうち、指定したkeyに設定されているポインタの実態（オブジェクト）を検索します。
  * objectはmobile backend に保存済みである必要がある。
  *
  * @method DataStore<T>#inQuery
  * @param {string} key ポインタを保存したキー
  * @param {DataStore<T>} subquery 検索条件
  * @return this
  */
  static inQuery(key: string, subquery: typeof DataStore): typeof this;
  
  /**
  * 指定したkeyに設定されているポインタの実態（オブジェクト）を検索し、返却値として返します。
  * 複数回実行した場合、最後に設定したキーが反映されます。複数のキーを指定することはできません。
  *
  * @method DataStore<T>#include
  * @param {string} key ポインタの中身を取得するキー
  * @return this
  */
  static include(key: string): typeof this;

  /**
  * 検索結果の配列と共に、検索結果の総件数を取得するよう設定します。
  * 検索結果の配列は最大100件までしか取得しませんが、countは検索結果の総件数を表示します。
  * 検索結果配列にcountプロパティとして付加されます。
  *
  * @method DataStore<T>#count
  * @return this
  */
  static count(): typeof this;

  /**
  * 指定したkeyをソートして検索結果を取得するよう設定します。
  *（複数設定可能。先に指定したkeyが優先ソートされる。）
  * フラグによって降順ソートも可能です。降順フラグはキーごとに設定できます。
  *
  * @method DataStore<T>#order
  * @param {string} key ソートするキー
  * @param descending trueを指定した場合、降順でソートされる。省略可能。
  * @return this
  */
  static order(key: string, descending?: boolean): typeof this;
  
  /**
  * 検索結果の最大取得数を設定します。設定値は1から1000まで、デフォルト値は100です。
  *
  * @method DataStore<T>#limit
  * @param {number} limit 最大取得件数
  * @return this
  */
  static limit(limit: number): typeof this;

  /**
  * 指定したskipの件数だけ頭から除いた検索結果を取得するよう設定します。
  *
  * @method DataStore<T>#skip
  * @param {number} skip 検索結果から除く件数
  * @return this
  */
  static skip(skip: number): typeof this;

  /**
  * objectIdから一意のオブジェクトを取得します。
  *
  * @method DataStore<T>#fetchById
  * @param {string} id 取得したいオブジェクトのobjectId
  * @param {function} [callback] コールバック関数
  * @return {Promise<T>} オブジェクト
  */
  static fetchById(id: string, callback?: Function): Promise<DataStore | User | Push | Installation | Role | File>;
  
  /**
  * 検索条件に合致するオブジェクトのうち、先頭の一つだけを取得します。
  *
  * @method DataStore<T>#fetch
  * @param {function} [callback] コールバック関数
  * @return {Promise<T>} 検索結果に合致したオブジェクト
  */
  static fetch(callback?: Function): Promise<DataStore | User | Push | Installation | Role | File>;
  
  /**
  * 検索条件に合致するオブジェクトをすべて取得します。
  *
  * @method DataStore<T>#fetchAll
  * @param {function} [callback] コールバック関数
  * @return {Promise<Array<T>>} 検索結果に合致したオブジェクトの配列
  */
  static fetchAll(callback?: Function): Promise<Array<DataStore | User | Push | Installation | Role | File>>;

  /**
  * 指定したキー設定されている値を取得します。
  *
  * @method Operation#get
  * @param {string} key 値を取得したいキー
  * @return {object} keyに対応する値 
  */
  get(key: string): any;

  /**
  * 指定したキーに値を設定します。
  *
  * @method Operation#set
  * @param {string} key 値を設定したいキー
  * @param value キーに設定する値
  * @return this
  */
  set(key: string, value: any): this;

  /**
  * 更新時に、指定したキーの値を指定分だけ増加させる設定をします。
  *
  * @method Operation#setIncrement
  * @param {string} key 処理を設定したいキー
  * @param {number} amount 更新時の増加量。省略可能で、その場合は1が設定される
  * @return this
  */
  setIncrement(key: string, amount?: number): this;

  /**
  * 更新時に、指定したキーの配列末尾にオブジェクトを追加する設定をします。
  * objectsは単一オブジェクトおよび配列での複数指定が共に可能。
  * 複数回実行することで、objects末尾にさらにオブジェクトを追加することも可能。
  *
  * @method Operation#add
  * @param {string} key 処理を設定したいキー
  * @param  objects 更新時に配列に追加する値もしくは値の配列
  * @return this
  */
  add(key: string, objects: any | any[]): this;

  /**
  * 更新時に、指定したキーの配列末尾に、重複したデータを避けてオブジェクトを追加する設定をします。
  * objectsは単一オブジェクトおよび配列での複数指定が共に可能。
  * 複数回実行することで、objects末尾にさらにオブジェクトを追加することも可能。
  *
  * @method Operation#addUnique
  * @param {string} key 処理を設定したいキー
  * @param  objects 配列に追加する値もしくは値の配列。既にobjectsにある値を追加しようとした場合エラーが返る
  * @return this
  */
  addUnique(key: string, objects: any | any[]): this;

  /**
  * 更新時に、指定したキーの配列からオブジェクトを削除する設定をします。
  * objectsは単一オブジェクトおよび配列での複数指定が共に可能。
  * 複数回実行することで、objects末尾にさらにオブジェクトを追加することも可能。
  *
  * @method Operation#remove
  * @param {string} key 処理を設定したいキー
  * @param  objects 配列から削除する値もしくは値の配列
  * @return this
  */
  remove(key: string, objects: any | any[]): this;

  /**
  * オブジェクトを保存します。
  *
  * @method NCMB.DataStore#save
  * @param {function} callback? コールバック関数
  * @return {Promise<this>}
  */
  save(callback?: Function): Promise<this>;

  /**
  * オブジェクトを更新します。
  *
  * @method NCMB.DataStore#update
  * @param {function} callback? コールバック関数
  * @return {Promise<this>}
  */
  update(callback?: Function): Promise<this>;

  /**
  * オブジェクトを削除します。
  *
  * @method NCMB.DataStore#delete
  * @param {function} callback? コールバック関数
  * @return {Promise<void>}
  */
  delete(callback?: Function): Promise<void>;
}

/**
* 会員および会員権限によるオブジェクトへのアクセスの管理を扱うクラスです。
*
* サインアップで登録の後、ログインすることでセッショントークンを取得します。
* セッショントークンを保持しているユーザをカレントユーザに設定することで、そのユーザの権限でオブジェクトにアクセスできるようになります。
* セッショントークンの有効期限はデフォルトで24時間です。期限切れの場合は一度ログアウトした後再度ログインを行ってください。（有効期限はダッシュボードで変更できます。）
*
* サインアップできるユーザ種別は、ユーザ名/パスワードでの認証、メールアドレス/パスワードでの認証、SNS連携(Facebook/Twitter/Google/Apple)での認証があります。
* 認証方法によって登録時・ログイン時に使用するメソッドが変わります。
*
* ※注意：
* ２種類のメソッド（インスタンスメソッド Instance method とスタティックメソッド Static method）があります。
* それぞれリファレンス上の表記と利用時のメソッドが異なりますので、下記を参考にご利用ください。
*
*   - リファレンス上の表記が「NCMB.User#メソッド名」: インスタンスメソッド Instance method
*      - 利用例）NCMB.User#login
*        ```
*        var user = new ncmb.User({userName:"Yamada Tarou", password:"password"});
*        user.login();
*        ```
*   - リファレンス上の表記が「NCMB.UserConstructor#メソッド名」: スタティックメソッド Static method
*      - 利用例）NCMB.UserConstructor#login
*        ```
*        ncmb.User.login("Yamada Tarou", "password");
*        ```
*/
export class User extends DataStore {
  /**
  * コンストラクターです。
  * 
  * @param {Object} attrs インスタンス生成時に設定するプロパティ
  */
  constructor(attrs?: any);
  
  /**
  * 現在セッションに使用しているユーザの情報を取得します。
  * セッションにセッショントークンを利用していない場合、nullが返ります。
  * また、画面遷移などでログイン中にセッショントークン情報が失われてしまった場合、
  * getCurrentUserを実行することで、ローカルに保存されているカレントユーザ情報から
  * セッショントークンを設定し直します。
  *
  * @method NCMB.UserConstructor#getCurrentUser
  * @return {NCMB.User} セッション中のユーザオブジェクト
  */
  static getCurrentUser(): User;

  /**
  * 現在セッションに使用しているユーザかどうかを判別します。
  *
  * @method NCMB.User#isCurrentUser
  * @return {boolean} true/false
  */
  isCurrentUser(): boolean;

  /**
  * ユーザ名とパスワード認証でユーザを登録します。
  *
  * @method NCMB.User#signUpByAccount
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>}
  */
  signUpByAccount(callback?: Function): Promise<User>;

  /**
  * SNS連携認証でユーザを登録します。
  * インスタンスのauthDataプロパティに適切なJSONオブジェクトが設定されている場合、providerおよびdataは省略可能です。
  * 複数のプロバイダ情報を一度に登録することは出来ません。
  * 会員登録のみ実施し、ログイン処理および、カレントユーザへの反映を行いません。カレントユーザを反映したい場合、ncmb.User.loginWith(user)を行ってください。
  *
  * @method NCMB.User#signUpWith
  * @param {string} provider 連携するサービスプロバイダ名 Facebook/Twitter/Google/Apple
  * @param {Object} data 認証に必要な情報を保持したJSON形式のオブジェクト
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>}
  */
  signUpWith(provider: string, data: object, callback?: Function): Promise<User>;

  /**
  * メールアドレス認証ユーザの登録メールアドレス宛にパスワード再設定のメールを送信します。
  *
  * @method NCMB.User#requestPasswordReset
  * @param {function} [callback] コールバック関数
  * @return {Promise<any>} APIレスポンス
  */
  requestPasswordReset(callback?: Function): Promise<any>;

  /**
  * パスワードをリセットするために指定したmailAddressメールアドレスにメールを送信します。
  *
  * @method NCMB.UserConstructor#requestPasswordReset
  * @param {string} mailAddress 登録するメールアドレス
  * @param {function} [callback] コールバック関数
  * @return {Promise<any>} APIレスポンス
  */
  static requestPasswordReset(mailAddress: string,callback?: Function): Promise<any>;

  /**
  * メールアドレス認証の登録メールを送信します。
  * メール内でパスワード入力を行い、登録が完了した時点で認証が可能となります。
  *
  * @method NCMB.UserConstructor#requestSignUpEmail
  * @param {string} mailAddress 登録するメールアドレス
  * @param {function} [callback] コールバック関数
  * @return {Promise<any>} APIレスポンス
  */
  static requestSignUpEmail(mailAddress: string,callback?: Function): Promise<any>;



  /**
  * ログイン（セッショントークンの取得）およびカレントユーザへの設定を行います。
  * userNameおよびpasswordプロパティをもつUserインスタンスを第一引数に設定しそのユーザでログイン可能です。
  * その場合、第二引数を省略可能です。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method NCMB.UserConstructor#login
  * @param {string | NCMB.User} userName ユーザ名
  * @param {string | function} [password] パスワード
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>} ログインしたUserインスタンス
  */
  static login(userName: string | User, password?: string | Function, callback?: Function): Promise<User>;

  /**
  * ログイン（セッショントークンの取得）を行います。
  * カレントユーザへの設定は行いません。
  * userNameおよびpasswordプロパティを保持している必要があります。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method NCMB.User#login
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>}
  */
  login(callback?: Function): Promise<User>;

  /**
  * ログイン（セッショントークンの取得）およびカレントユーザへの設定を行います。
  * mailAddressおよびpasswordプロパティをもつUserインスタンスを第一引数に設定し、そのユーザでログイン可能です。
  * その場合、第二引数を省略可能です。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method NCMB.UserConstructor#loginWithMailAddress
  * @param {string|NCMB.User} mailAddress メールアドレス
  * @param {string|function} [password] パスワード
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>} ログインしたUserインスタンス
  */
  static loginWithMailAddress(mailAddress: string | User, password: string | Function, callback?: Function): Promise<User>;

  /**
  * ログイン（セッショントークンの取得）を行います。
  * カレントユーザへの設定は行いません。
  * mailAddressおよびpasswordプロパティを保持している必要があります。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method NCMB.User#loginWithMailAddress
  * @param {function} [callback] コールバック関数
  * @return {Promise<this>}
  */
  loginWithMailAddress(callback?: Function): Promise<User>;

  /**
  * 匿名ユーザとしてログイン（セッショントークンの取得）を行います。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * UUIDは省略可能です。省略した場合、UUIDを乱数で自動生成します。
  * UUIDにUserのインスタンスを入力し、そのインスタンスでログイン可能です。
  * その場合、userNameもしくはauthDataプロパティを持つインスタンスではログインできません。
  *
  * @method NCMB.UserConstructor#loginAsAnonymous
  * @param {string} uuid 端末固有のUUID
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>} ログインしたUserインスタンス
  */
  static loginAsAnonymous(uuid: string, callback?: Function): Promise<User>;

  /**
  * 匿名ユーザとしてログイン（セッショントークンの取得）を行います。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * UUIDは省略可能です。省略した場合、UUIDを乱数で自動生成します。
  * userNameもしくはauthDataプロパティを持つインスタンスではログインできません。
  *
  * @method NCMB.User#loginAsAnonymous
  * @param {string} uuid 端末固有のUUID
  * @param {function} [callback] コールバック関数
  * @return {Promise<this>}
  */
  loginAsAnonymous(uuid: string, callback?: Function): Promise<User>;

  /**
  * SNS連携認証ユーザとしてログイン（セッショントークンの取得）およびカレントユーザへの設定を行います。
  * authDataプロパティをもつUserインスタンスを第一引数に設定し、そのユーザでログイン可能です。
  * その場合、第二引数を省略可能です。
  * また、authDataに複数のSNS連携情報を持つインスタンスを設定する場合、第二引数で認証に使用するプロバイダを指定する必要があります。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  * メソッドの返却値はログインしているユーザの情報です。
  *
  * @method NCMB.UserConstructor#loginWith
  * @param {string|NCMB.User} provider 連携するサービスプロバイダ名 Facebook/Twitter/Google/Apple
  * @param {Object|function} [data] 認証に必要な情報を保持したJSON形式のオブジェクト
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>} ログインしたUserインスタンス
  */
  static loginWith(provider: string | User, data?: object | Function, callback?: Function): Promise<User>;

  /**
  * SNS連携認証ユーザとしてログイン（セッショントークンの取得）を行います。
  * authDataプロパティをもつ場合、第一・第二引数を省略可能です。
  * また、authDataに複数のSNS連携情報を持つ場合、第一引数で認証に使用するプロバイダを指定する必要があります。
  * authDataプロパティをもち、かつprovide, dataを入力した場合、入力された情報で認証を行います。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  * ログインのみ実施しますが、カレントユーザへの反映を行いません。カレントユーザを反映したい場合、ncmb.User.loginWith(user)を行ってください。
  *
  * @method NCMB.User#loginWith
  * @param {string} [provider] 連携するサービスプロバイダ名 Facebook/Twitter/Google/Apple
  * @param {Object} [data] 認証に必要な情報を保持したJSON形式のオブジェクト
  * @param {function} [callback] コールバック関数
  * @return {Promise<this>}
  */
  loginWith(provider: string, data: object, callback?: Function): Promise<User>;

  /**
  * カレントユーザ情報およびセッショントークンの破棄を行います。
  * カレントユーザに設定されていたインスタンス自体のセッショントークン情報は保持され続けます。
  * 別途プロトタイプメソッドでインスタンスのログアウトを実行してください。
  *
  * @method NCMB.UserConstructor#logout
  * @param {function} [callback] コールバック関数
  * @return {Promise<User>} ログアウトしたユーザインスタンス
  */
  static logout(callback?: Function): Promise<User>;

  /**
  * インスタンスのセッショントークンの破棄を行います。
  * カレントユーザに設定されているユーザをこのメソッドでログアウトした場合でもカレントユーザ情報は破棄されません。
  * そのままAPIリクエストを行った場合、不正なセッショントークン利用でエラーが返ります。
  *
  * @method NCMB.User#logout
  * @param {function} [callback] コールバック関数
  * @return {Promise<this>}
  */
  logout(callback?: Function): Promise<User>;

  /**
  * メールアドレスの確認を行っているかどうかを判別します。
  *
  * @method NCMB.User#isMailAddressConfirmed
  * @return {boolean} 確認済みの場合はtrue/以外はfalse
  */
  isMailAddressConfirmed(): boolean;

  /**
   * Facebook/Google/Twiter/Apple等のSNSアカウントと連絡を行います。
   *
   * @method linkWith
   * @param {string} provider 連携するサービスプロバイダ名 Facebook/Twitter/Google/Apple
   * @param {Object} data 認証に必要な情報を保持したJSON形式のオブジェクト
   * @param {function} callback コールバック関数
   * @return this.
   */
  linkWith(provider: string, data: object, callback?: Function): Promise<User>;

  /**
   * Facebook/Twitter/Google/Apple等のSNSアカウントの連携を削除します。
   *
   * @method unLinkWith
   * @param {string} provider 連携するサービスプロバイダ名 Facebook/Twitter/Google/Apple
   * @param {function} callback コールバック関数
   * @return this.
   */
  unLinkWith(provider: string, callback?: Function): Promise<User>;
}


/**
* 位置情報を扱うクラスです。
*
* ncmbオブジェクトのプロパティに設定して利用します。
*/
export class GeoPoint {
  latitude: number;
  longitude: number;
  /**
  * コンストラクターです。
  * 
  * @param {number} lat 緯度 -90~90の範囲で指定する
  * @param {number} lng 経度 -180~180の範囲で指定する
  */
  constructor(latitude?: number, longitude?: number);
}

/**
* オブジェクトへのアクセス権限を設定するクラスです。
*
* DataStoreやUserクラスのインスタンスに付加して利用します。<br>
* 指定するユーザおよびロールはmobile backendに保存済みである必要があります。
*/
export class Acl {
  /**
  * コンストラクターです。
  * @param {Object} permissions Acl情報のJSONオブジェクト
  */
  constructor(permissions?: object);
  /**
  * 全体への読み込み権限を設定します。
  *
  * @method NCMB.Acl#setPublicReadAccess
  * @param {boolean} allowed true/false
  * @return {NCMB.Acl} 権限追加後のインスタンス
  */
  setPublicReadAccess(allowed: boolean): Acl;

  /**
  * 全体への書き込み権限を設定します。
  *
  * @method NCMB.Acl#setPublicWriteAccess
  * @param {boolean} allowed true/false
  * @return {NCMB.Acl} 権限追加後のインスタンス
  */
  setPublicWriteAccess(allowed: boolean): Acl;

  /**
  * 特定ユーザへの読み込み権限を設定します。
  *
  * @method NCMB.Acl#setUserReadAccess
  * @param {NCMB.User} user Userのインスタンス
  * @param {boolean} allowed true/false
  * @return {NCMB.Acl} 権限追加後のインスタンス
  */
  setUserReadAccess(user: User, allowed: boolean): Acl;

  /**
  * 特定ユーザへの書き込み権限を設定します。
  *
  * @method NCMB.Acl#setUserWriteAccess
  * @param {NCMB.User} user Userのインスタンス
  * @param {boolean} allowed true/false
  * @return {NCMB.Acl} 権限追加後のインスタンス
  */
  setUserWriteAccess(user: User, allowed: boolean): Acl;

  /**
  * 特定ロールへの読み込み権限を設定します。
  * roleNameにロールのインスタンスを入力することもできます。
  *
  * @method NCMB.Acl#setRoleReadAccess
  * @param {string} roleName ロール名
  * @param {boolean} allowed true/false
  * @return {NCMB.Role} 権限追加後のインスタンス
  */
  setRoleReadAccess(roleName: string, allowed: boolean): Acl;

  /**
  * 特定ロールへの書き込み権限を設定します。
  * roleNameにロールのインスタンスを入力することもできます。
  *
  * @method NCMB.Acl#setRoleWriteAccess
  * @param {string} roleName ロール名
  * @param {boolean} allowed true/false
  * @return {NCMB.Role} 権限追加後のインスタンス
  */
  setRoleWriteAccess(roleName: string, allowed: boolean): Acl;

  /**
  * 指定したユーザもしくはロールに設定されている権限を取得します。
  *
  * @method NCMB.Acl#get
  * @param {NCMB.User|NCMB.Role|string} target 権限を取得するユーザもしくはロールのインスタンス。全体の権限を取得する場合は"public"を入力
  * @param {string} type read/write
  * @return {NCMB.Role} true/false
  */
  get(target: User | Role | string, type: string): boolean;
}

/**
* ロールについて扱うクラスです。
*
* ユーザや他のロール（子ロール）をまとめて権限管理を行うことができます。
* ユーザおよび子ロールの追加・削除はsave/update完了時に反映されます。
*
* ロールへのユーザもしくは子ロールの追加と削除を同時に行うことはできません。
* 追加・削除の設定を行い、保存前に他方を設定した場合、後に行った処理が上書きされます。
*
* ※注意：
* ２種類のメソッド（インスタンスメソッド Instance method とスタティックメソッド Static method）があります。
* それぞれリファレンス上の表記と利用時のメソッドが異なりますので、下記を参考にご利用ください。
*
*   - リファレンス上の表記が「NCMB.Role#メソッド名」: インスタンスメソッド Instance method
*      - 利用例）NCMB.Role#addUser
*       ```
*      var freePlanRole = new ncmb.Role("freePlan");
*      freePlanRole.addUser(user);
*      ```
*   - リファレンス上の表記が「NCMB.RoleConstructor#メソッド名」: スタティックメソッド Static method
*      - Roleの場合は、お客様に提供するスタティックメソッドはありません。
*
*/
export class Role extends DataStore {
  /**
  * コンストラクターです。
  * 
  * @param {string} roleName ロール名。インスタンス生成時に必須
  * @param {Object} attrs インスタンス生成時に設定するプロパティ
  */
  constructor(roleName: string, attrs?: Object);
  /**
  * ロールにユーザを追加します。
  *
  * @method NCMB.Role#addUser
  * @param {User|Array<User>} object 追加するユーザ
  * @return {this}
  */
  addUser(object: User | User[]): Promise<Role>;

  /**
  * ロールに子ロールを追加します。
  *
  * @method NCMB.Role#addRole
  * @param {Role|Array<Role>} object 追加する子ロール
  * @return {this}
  */
  addRole(object: Role | Role[]): Role;

  /**
  * ロールからユーザを削除します。
  *
  * @method NCMB.Role#removeUser
  * @param {User} object 削除するユーザ
  * @return {this}
  */
  removeUser(object: User): Role;

  /**
  * ロールから子ロールを削除します。
  *
  * @method NCMB.Role#removeRole
  * @param {Role} object 削除する子ロール
  * @return {this}
  */
  removeRole(object: Role): Role;

  /**
  * ロールに登録されているユーザの一覧を取得します。
  *
  * @method NCMB.Role#fetchUser
  * @param {function} [callback] コールバック関数
  * @return {Promise<Array<User>>} ユーザインスタンスの配列
  */
  fetchUser(callback?: Function): Promise<User[]>;

  /**
  * ロールに登録されている子ロールの一覧を取得します。
  *
  * @method NCMB.Role#fetchRole
  * @param {function} [callback] コールバック関数
  * @return {Promise<Array<Role>>} 子ロールインスタンスの配列
  */
  fetchRole(callback?: Function): Promise<Role[]>;
}

/**
* プッシュ配信端末の操作を扱うクラスです。
*
* ※注意：
* ２種類のメソッド（インスタンスメソッド Instance method とスタティックメソッド Static method）があります。
* それぞれリファレンス上の表記と利用時のメソッドが異なりますので、下記を参考にご利用ください。
*
*   - リファレンス上の表記が「NCMB.Installation#メソッド名」: インスタンスメソッド Instance method
*      - 利用例）NCMB.Installation#update
*        ```
*        var installation = ncmb.Installation()
*        installation.objectId = "xxxxxxx";
*        installation.set("region", "Asia");
*        installation.update();
*        ```
*   - リファレンス上の表記が「NCMB.InstallationConstructor#メソッド名」: スタティックメソッド Static method
*      - Installationの場合は、お客様に提供するスタティックメソッドはクエリQueryのみになります。
*/
export class Installation extends DataStore {
}

/**
* ファイルストアへの入出力を扱うクラスです。
*
* このクラスはすべてクラスメソッドで構成されており、インスタンスを生成せずに利用します。
* Queryではファイルの付加情報（ファイル名、更新日時など）のみを検索・取得し、ファイルのバイナリデータそのものは取得しません。
* バイナリデータを取得したい場合はdownloadメソッドを利用してください。
*
* ※注意：
* ２種類のメソッド（インスタンスメソッド Instance method とスタティックメソッド Static method）があります。
* それぞれリファレンス上の表記と利用時のメソッドが異なりますので、下記を参考にご利用ください。
*
*   - リファレンス上の表記が「NCMB.File#メソッド名」: インスタンスメソッド Instance method
*      - Fileの場合は、お客様に提供するインスタンスメソッドはありません
*   - リファレンス上の表記が「NCMB.FileConstructor#メソッド名」: スタティックメソッド Static method
*      - 利用例）NCMB.FileConstructor#download
*        ```
*        ncmb.File.download("abc.txt")
*        .then(function(fileData){
*        // ファイル取得後処理
*        })
*        .catch(function(err){
*        // エラー処理
*        });
*        ```
*/
export class File extends DataStore {
  /**
  * ファイルストアにファイルを保存します。
  *
  * @method NCMB.FileConstructor#upload
  * @param {String} fileName 取得するバイナリデータのファイル名
  * @param {} fileData 保存するファイルデータ
  * @param {NCMB.Acl|function} [acl] ファイルに対するアクセス権減
  * @param {function} [callback]
  * @return {Promise<any>} APIレスポンス
  */
  static upload(fileName: string, fileData: any, acl?: Acl | Function, callback?: Function): Promise<any>;

  /**
 * 指定したファイルのバイナリデータを取得します。
 *
 * @method NCMB.FileConstructor#download
 * @param {String} fileName 取得するバイナリデータのファイル名
 * @param {String} [responseType] レスポンスバイナリのデータ形式 arraybuffer/blob (ブラウザ/Monaca利用時のみ必要)
 * @param {Function} [callback] コールバック関数
 * @return {Promise<any>} ファイルのバイナリデータ（付加情報は取得しません）
 */
  static download(fileName: string, responseType?: string, callback?: Function): Promise<any>;

  /**
 * 指定したファイルのACL情報を更新します。
 *
 * @method NCMB.FileConstructor#updateACL
 * @param {String} fileName 更新するファイル名
 * @param {NCMB.Acl} acl 更新後のacl情報を設定したncmb.ACLインスタンス
 * @param {Function} [callback] コールバック関数
 * @return {Promise<any>} APIレスポンス
 */
  static updateACL(fileName: string, acl: Acl, callback?: Function): Promise<any>;

  /**
 * 指定したファイルを削除します。
 *
 * @method NCMB.FileConstructor#delete
 * @param {String} fileName 削除するファイル名
 * @param {Function} [callback] コールバック関数
 * @return {Promise<void>}
 */
  static delete(fileName: string, callback?: Function): Promise<void>;
}

/**
* プッシュ通知の操作を扱うクラスです。
* ※注意：
* ２種類のメソッド（インスタンスメソッド Instance method とスタティックメソッド Static method）があります。
* それぞれリファレンス上の表記と利用時のメソッドが異なりますので、下記を参考にご利用ください。
*
*   - リファレンス上の表記が「NCMB.Push#メソッド名」: インスタンスメソッド Instance method
*      - 利用例）NCMB.Push#send
*     ```
*     var push = new ncmb.Push();
*     push.set("immediateDeliveryFlag", true)
*          .set("message", "Hello, World!")
*          .set("target", ["ios", "android"]);
*     push.send()
*     ```
*   - リファレンス上の表記が「NCMB.PushConstructor#メソッド名」: スタティックメソッド Static method
*      - Pushの場合は、お客様に提供するスタティックメソッドはクエリQueryのみになります。
*
*/
export class Push extends DataStore {
  /**
   * コンストラクターです。
  */
  constructor();
  /**
  * プッシュ通知をmobile backendに登録します。
  * 即時配信フラグがtrueの場合はすぐに配信されます。
  *
  * @method NCMB.Push#send
  * @param {function} [callback] コールバック関数
  * @return {Promise<this>}
  */
  send(callback?: Function): Promise<Push>;
}

/**
* リレーションについて扱うクラスです。
*
* オブジェクトのプロパティに対してインスタンスを設定することで、同一クラスに限り複数のオブジェクトを関連づけることができます。
* 関連づけるオブジェクトがすべて同一クラスであれば、関連づけられるオブジェクトとは別クラスでも指定可能です。
*
* インスタンス生成時に関連づけるクラス名を指定可能です。指定しなかった場合、最初に追加したオブジェクトのクラスが指定されます。
* 指定した以外のクラスのインスタンスを入力した場合、エラーが返ります。
*
* ※注意：
* ２種類のメソッド（インスタンスメソッド Instance method とスタティックメソッド Static method）があります。
* それぞれリファレンス上の表記と利用時のメソッドが異なりますので、下記を参考にご利用ください。
*
*   - リファレンス上の表記が「NCMB.Relation#メソッド名」: インスタンスメソッド Instance method
*      - 利用例）NCMB.Relation#add
*        ```
*       var relation = new ncmb.Relation();
*       relation.add(food1).add(food2);
*        ```
*   - リファレンス上の表記が「NCMB.RelationConstructor#メソッド名」: スタティックメソッド Static method
*      - Relationの場合は、お客様に提供するスタティックメソッドはありません。
*
* @class NCMB.Relation
* 
*/
export class Relation {
  /**
  * コンストラクターです。
  * 
  * @param {string} relatingClass 関連づけるクラス名。省略可能
  */
  constructor(relatingClass?: string);

  /**
  * 関連オブジェクトに追加するオブジェクトを設定します。
  *
  * @method NCMB.Relation#add
  * @param object 追加するオブジェクト
  * @return {this}
  */
  add(object: Object): Relation;

  /**
  * 関連オブジェクトから削除するオブジェクトを設定します。
  *
  * @method NCMB.Relation#remove
  * @param object 削除するオブジェクト
  * @return {this}
  */
  remove(object: Object): Relation;
}

/**
* Scriptの実行を扱うクラスです。
*
* メソッドは全て実行可能なインスタンスを生成し、状態を付与して返すファクトリメソッドです。
* メソッドチェインでヘッダ、ボディ、クエリを付与し、execメソッドで実行します。
*
* Script機能からのresponseは型が固定でないため、bodyキーにレスポンスを格納したObjectを返却します。
*/
export class Script {
  /**
  * インスタンスに対してチェインしてリクエストヘッダを付与するメソッドです。
  *
  * @method NCMB.Script#set
  * @param  {Object} header リクエストヘッダを示すJSON形式のオブジェクト
  * @return {NCMB.Script} this   引数のリクエストヘッダが付加された実行可能インスタンス
  */
  static set(header: object): typeof Script;

  /**
  * インスタンスに対してチェインしてリクエストボディを付与するメソッドです。
  *
  * @method NCMB.Script#data
  * @param  {Object} body リクエストボディを示すJSON形式のオブジェクト
  * @return {NCMB.Script} this 引数のリクエストボディが付加された実行可能インスタンス
  */
  static data(body: object): typeof Script;

  /**
  * インスタンスに対してチェインしてクエリストリングを付与するメソッドです。
  *
  * @method NCMB.Script#query
  * @param  {Object} query クエリストリングを示すJSON形式のオブジェクト
  * @return {NCMB.Script} this  引数のクエリストリングが付加された実行可能インスタンス
  */
  static query(query: object): typeof Script;

  /**
  * Scriptを実行するメソッドです。
  *
  * @method NCMB.Script#exec
  * @param  {string}  method      HTTPメソッド
  * @param  {string}  scriptName  スクリプトファイル名
  * @return {Object}  res         Scriptに定義されたレスポンスを内包するJSON形式のオブジェクト
  */
  static exec(method: string, scriptName: string, callback?: Function): Promise<object>;
}

export class UnmodifiableVariableError extends Error {}
export class InvalidWhereError extends Error {}
export class InvalidOffsetError extends Error {}
export class EmptyArrayError extends Error {}
export class InvalidLimitError extends Error {}
export class NoObjectIdError extends Error {}
export class NoRoleNameError extends Error {}
export class NoAuthInfoError extends Error {}
export class NoUserNameError extends Error {}
export class NoPasswordError extends Error {}
export class NoFileDataError extends Error {}
export class NoMailAddressError extends Error {}
export class NoFileNameError extends Error {}
export class NoACLError extends Error {}
export class NoProviderInfoError extends Error {}
export class NoOAuthDataError extends Error {}
export class InvalidProviderError extends Error {}
export class InvalidOAuthDataError extends Error {}
export class InvalidArgumentError extends Error {}
export class NoSessionTokenError extends Error {}
export class InvalidFormatError extends Error {}
export class InvalidAuthInfoError extends Error {}
export class ContentsConflictError extends Error {}
export class UnReplaceableKeyError extends Error {}
export class UnknownAuthProviderError extends Error {}
export class OutOfRangeInputError extends Error {}
export class DuplicatedInputError extends Error {}
export class NotImplementedProviderValidationError extends Error {}
export class DifferentClassError extends Error {}
export class NoFilePathError extends Error {}
export class InvalidRequestHeaderError extends Error {}
export class InvalidRequestBodyError extends Error {}
export class InvalidRequestQueryError extends Error {}
