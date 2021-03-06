/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = checkModulesLoaded;
/* harmony export (immutable) */ __webpack_exports__["b"] = noop;


function checkModulesLoaded(moduleList){
    if(typeof angular === 'undefined'){
        throw new Error('ERROR: Angular is not defined. Please include it first.');
        return;
    }
    moduleList.forEach(module => {
        try {
            angular.module(module);
        } catch(err) {
            console.error(`Error: dependency ${module} not loaded.`);
        }
    });
};

function noop(){};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


class Form{
    /**
     * Pushes error messages to an angular form
     * @param   {object}    $form   the reference of the form
     * @return  {function}
     */
    static pushValidationMessageToForm($form, reject){
        return function(response){
            if($form !== undefined && typeof $form.$setPristine == 'function'){
                if(response.status == 400 && response.data.error){
                    $form.general = {
                        $error : {}
                    };
                    if(typeof response.data.error == 'string'){
                        $form.general.$error.error =
                            Array.isArray(response.data.error) ?
                            response.data.error : [response.data.error];
                    }else{
                        Object.keys($form).forEach(function(key){
                            let value = response.data.error[key];
                            if($form[key] && $form[key].$error)
                            $form[key].$error.error = value;
                        });
                    }
                }
            }
            return (reject || __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* noop */])(response);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Form;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__form__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = PCAuthProvider;





let _PCUser,
    _$http,
    _$timeout,
    _lodash,
    _$q,
    _$cookies,
    _jwtHelper
    ;

class User{
    constructor(data){
        let user = this;

        this.name = data.name || '';
        this.email = data.email || '';
        this.role = data.role;
        this.role_object = data.roleObject || {};
        this.meta = data.meta || {};
        this.token = data.token;

        this.tokenExpirationHandled = false;

        Object.keys(data).forEach(function(key){
            var patt = new RegExp(/^\$/);
            if(!patt.test(key)){
                user[key] = data[key];
            }
        });
    };

    /**
     * Check if user had one of the provided roles
     * @param {Array<Number>|String|Number}    role  role or role list
     */
    hasRole(role){
        let roleList = [];

        if(role && Array.isArray(role)){
            roleList = role;
        }else if (role && typeof role == 'string') {
            roleList = [Number(role)];
        }else if(role && typeof role == 'number'){
            roleList = [role];
        }else{
            return true;
        }

        return roleList.indexOf(this.role) > -1;
    };

    /**
     * Cheks the token lifetime and returns different values
     * according to the remaining time
     * @return
     *          null    if no token
     *          true    if more than 10 seconds remaining
     *          -1      if less than 10 seconds remaining and need to react
     *          -2      if less than 10 seconds remaining but already reacted
     *          -3      if still no proper token
     */
    checkToken(){
        if(!this.token){
            return null;
        }else{
            let expiration = _jwtHelper.getTokenExpirationDate(this.token);
            var now = new Date;
            var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
                 now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
            let difference = expiration - utc_timestamp;

            // console.log(`Token will expire in ${difference / 1000} seconds`, `At ${expiration.toString()}`);
            if(difference > 10 * 1000){
                return true;
            }else if(difference < 10 * 1000 && difference >= 0){
                if(!this.tokenExpirationHandled){
                    this.tokenExpirationHandled = true;
                    return -1;
                    return;
                }else{
                    return -2;
                }
            }else{
                if(this.tokenExpirationHandled && this.token){
                    this.token = null;
                    return -3;
                }
                this.token = null;
                return null;
            }
        }
    }

    /**
     * Call after token refreshed to reinitialize the handler
     * @param  {String} token new token
     * @return {void}
     */
    refresh(token){
        this.token = token;
        this.tokenExpirationHandled = false;
    }
}
/* unused harmony export User */
;

/**
 * Default configuration Object
 */
class AuthConfig{
    constructor(){
        this.endpoint = '/api/';
        this.tokenRefreshEndpoint = '/refresh-token';
        this.onTokenExpiration = (auth) => {
            auth.refreshToken();
        };
    }
}
/* unused harmony export AuthConfig */
;

/**
 * Auth Class
 */
class Auth{

    constructor(config){
        this.statusChangeCallbacks = [];
        this._authChecked = false;
        this.config = config;
        this._me = this._getMe();
        this._tokenChecker();
    };

    /**
     * Handles form errors
     * @param   {Objec}                 $form   Angular form
     * @param   {Function}(optional)    reject  reject callback, what should be
     *                                  called after form error handling
     * @return  {Fuction}
     */
    errorHandler($form, reject){
        return __WEBPACK_IMPORTED_MODULE_0__form__["a" /* default */].pushValidationMessageToForm($form, reject);
    }

    /**
     * Get the current user data from the server
     * @return {Promise}    User object
     */
    _getMe(){
        // Actual request goes here:
        let _auth = this;
        return _$q(function(resolve, reject){
            if(_$cookies.get('token')){
                _PCUser.me().$promise
                    .then(function(response){
                        _auth._me = new User(response);
                        resolve(_auth._me);
                    })
                    .catch(function(response){
                        _$cookies.remove('token');
                        _auth._me = new User({});
                        resolve(_auth._me);
                    });

            }else{
                _auth._me = new User({});
                resolve(_auth._me);
            }
        });
    }

    /**
     * Add callback to the status change callback array
     */
    _addStatusChangeCallback(cb){
        let auth = this;
        if(typeof cb !== 'function'){
            console.error(`Status change callback must be a function. ${typeof cb} given.`);
            return;
        }

        auth.statusChangeCallbacks.push(cb);
    }

    /**
     * Remove callback from the status change callback array
     */
    _removeStatusChangeCallback(cb){
        let auth = this;
        let index = auth.statusChangeCallbacks.indexOf(cb);
        if(index > -1){
            auth.statusChangeCallbacks.splice(index, 1);
        }else{
            console.warn('Calback could not found.');
        }
    }

    /**
     * Run status change callbacks
     */
    _runStatusChangeCallbacks(me){
        let auth = this;
        auth.statusChangeCallbacks.forEach(function(cb){
            cb(me);
        });
    }

    /**
     * Checks token on every seconds
     * @return {[type]} [description]
     */
    _tokenChecker(){
        if(!this.tokenCheckerInterval){
            this.tokenCheckerInterval = setInterval(() => {
                this.me.then((me) => {
                    let token = me.checkToken();
                    if(token === null){
                        // No token
                    }else if(token === undefined){
                        // No user
                    }else if(token === true){
                        // Token OK
                    }else if(token === -1){
                        // Token will expire need to handle
                        this.config.onTokenExpiration(this);
                    }else if(token === -2){
                        // token will expire but already handled
                    }else if(token === -3){
                        // token expired and not refreshed. Need to logout.
                        this.logout();
                    }
                });
            }, 1000);
        }
    }

    /**
     * Log in the current user
     * @param   {Object}            data    user data
     * @param   {Object}(optional)  $form   Angular form, what should be
     *                                      filled with error messeges
     * @return  {Promise}
     */
    login(data, $form, route){
        let auth = this;
        return new _$q(function(resolve, reject){
            return _$http
                .post(`${auth.config.endpoint}${route || 'login'}`, data)
                .then(res => {
                    if(res.status === 200){
                        _$cookies.put('token', res.data.token);
                        auth._me = new User(res.data);
                        auth._runStatusChangeCallbacks(auth._me);
                        return resolve(auth._me);
                    }else{
                        return auth.errorHandler($form, reject)(res);
                    }
                })
                .catch(auth.errorHandler($form, reject))
                ;
        });
    }

    /**
     * Log out the current user
     * @return {Promise}
     */
    logout(){
        let auth = this;
        return new _$q(function(resolve, reject){
            _$http.get(`${auth.config.endpoint}logout`)
            .then(response => {
                resolve(response);
            })
            .catch(response => {
                console.warn('User logged out, but got error from API.', response);
                resolve(response);
            })
            .finally(() => {
                _$cookies.remove('token');
                auth._me = new User({});
                auth._runStatusChangeCallbacks(auth._me);
            });
            ;
        });
    }

    /**
     * get the user object from the server
     * @return {Promise}
     */
    refreshUser(user){
        let auth = this;
        if(user){
            auth._me = new User(user);
        }else{
            auth._me = auth._getMe();
        }
        return auth.me
            .then((me) => {
                auth._runStatusChangeCallbacks(me);
            });
    }

    /**
     * Call for token refresh
     * @return {Promise} $q promise
     */
    refreshToken(){
        let auth = this;
        return new _$q(function(resolve, reject){
            return _$http
                .get(`${auth.config.tokenRefreshEndpoint}`)
                .then(res => {
                    if(res.status === 200){
                        _$cookies.put('token', res.data.token);
                        auth._me.refresh(res.data.token);
                        auth._runStatusChangeCallbacks(auth._me);
                        return resolve(auth._me);
                    }else{
                        return reject(res);
                    }
                })
                .catch((response) => {
                    console.error(response);
                })
                ;
        });
    }

    /**
     * Get the current user
     * @return {Promise}
     */
    get me(){
        let value = _lodash.get(this._me, '$promise') ? this._me.$promise : this._me;
        return _$q.when(value);
    }

    /**
     * Modifying user object outside of the class is not allowed
     * @param {object}  me  user object what won't be used
     * @return void
     */
    set me(me) {};

    getToken(){
        //console.log('get token');
    }

    /**
     * Checks if current user had roles
     * @param  {number|string|Array<number>}  roles [description]
     * @return {Boolean}       true if has
     */
    hasRole(roles){
        let value = _lodash.get(this._me, '$promise') ? this._me.$promise : this._me;
        return _$q.when(value)
            .then(me => {
                return me.hasRole(roles);
            })
    }

    /**
     * Add a callback which is called when user login status changes
     * Returns the remove function, so call it to deregister the specific
     * callback
     */
    onStatusChange(cb){
        let auth = this;
        auth._addStatusChangeCallback(cb);
        return function(){
            auth._removeStatusChangeCallback(cb);
        }
    }

}
/* unused harmony export Auth */
;

/**
 * PCAuth Provider
 */
function PCAuthProvider(){

    let self = this;

    self.config = new AuthConfig();

    self.$get = function(PCUser, $http, $timeout, $q, lodash, $cookies,
        jwtHelper){
         _PCUser = PCUser;
         _$http = $http;
         _$timeout = $timeout;
         _$q = $q;
         _lodash = lodash;
         _$cookies = $cookies;
         _jwtHelper = jwtHelper;
         return new Auth(self.config, PCUser);
     };
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = PCAuthInterceptorProvider;




var _config,
    _$injector,
    _$cookies,
    _$q
    ;

class responseErrorHandlers{

    constructor(){
        this[400] = function(data){
            // console.error('Error: 400', data);
        };
        this[401] = function(data){
            // console.error('Error: 401', data);
        };
        this[403] = function(data){
            // console.error('Error: 403', data);
        };
        this[404] = function(data){
            // console.error('Error: 403', data);
        };
        this[500] = function(data){
            // console.error('Error: 500', data);
        };
    }

}
/* unused harmony export responseErrorHandlers */
;

class InterceptorConfig{

    constructor(){
        this.responseErrorHandlers = new responseErrorHandlers();
    };

}
/* unused harmony export InterceptorConfig */
;

class AuthInterceptor{

    constructor(config){
        //console.log('Initiating AuthInterceptor', this);
        _config = config;
    };

    request(config){
        //console.log('AuthInterceptor', 'request');
        config.headers = config.headers || {};
        if(_$cookies.get('token')) {
            //console.log(`Bearer ${_$cookies.get('token')}`);
            config.headers.Authorization = `Bearer ${_$cookies.get('token')}`;
        }
        return config;
    };

    responseError(response){
        // console.error('AuthInterceptor', 'responseError', response);
        let handler = _config.responseErrorHandlers[response.status] || __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* noop */];
        handler(response.data, _$injector);
        return _$q.reject(response)
        // return response;
    };

}
/* unused harmony export AuthInterceptor */
;

function PCAuthInterceptorProvider(){

    let self = this;

    self.config = new InterceptorConfig();

    self.$get = function($injector, $cookies, $q){
        _$injector = $injector;
        _$cookies = $cookies;
        _$q = $q;
        return new AuthInterceptor(self.config );
    };

};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* unused harmony export RoleRestricterLink */
/* harmony export (immutable) */ __webpack_exports__["a"] = roleRestrictConfig;




let
    _PCAuth,
    _$parse
    ;

/**
 * Shows an element via removing `ng-hide` class
 * @param   {Object}   element      jqLite element
 */
function show(element){
    element.removeClass('ng-hide');
}

/**
 * Hides an element via adding `ng-hide` class
 * @param   {Object}   element      jqLite element
 */
function hide(element){
    element.addClass('ng-hide');
}

/**
 * Link function of the directive
 * Compares the passed number or array of numbers
 * with the users role number.
 * If the array contains the user's role, or the given number equals to
 * it, then it makes the element visible, otherwise hidden.
 */
function RoleRestricterLink($scope, element, attrs, controller,
        transclude) {

    transclude($scope, function (clone) {
        element.append(clone);
    });

    let
        me,
        watcher = __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* noop */],
        roles = _$parse(attrs.pcRoleRestrict)($scope);

    //First hide the element
    hide(element);


    _PCAuth.hasRole(roles)
        // When the user resolved, it comperses the roles
        .then(has => {
            (has ? show : hide)(element);
        })
        .catch(function(){
            show(element);
        })

    element.on('$destroy', function(){
        // Clean up $scope watcher
        watcher();
    });
};

function roleRestrictConfig(PCAuth, $parse) {

    _PCAuth = PCAuth;
    _$parse = $parse;

    return {
        restict: 'E',
        transclude: true,
        // scope: {
        //     restrict: '&pcRoleRestrict'
        // },
        link: RoleRestricterLink
    };
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export stateChangeHandler */
/* harmony export (immutable) */ __webpack_exports__["a"] = routerDecorator;


let
    Auth,
    _$state
    ;

function handleConfigError(stateName, role){
    console.error(
        `Error:\n
        Invalid restrict value provided in ${stateName}.\n
        It should be either number or array of numbers.\n
        ${typeof role} given.`);
        return;
}

function stateChangeHandler(event, nextState, nextParams, fromState,
        fromParams){

    // console.log('routerDecorator', nextState, fromState);
    if(!nextState.restrict){
        // console.log('routerDecorator no need to check role');
        return;
    }

    // console.log('routerDecorator need to check role');

    let allowedRoles = [];

    if(typeof nextState.restrict === 'number'){
        allowedRoles.push(nextState.restrict);
    }else if (typeof nextState.restrict == 'string') {
        if(isNaN(nextState.restrict)){
            return handleConfigError(nextState.name, nextState.restrict);
        }
        allowedRoles.push(Number(nextState.restrict));
    } else if(Array.isArray(nextState.restrict)){
        allowedRoles = nextState.restrict;
    }else{
        return handleConfigError(nextState.name, nextState.restrict);
    }

    let hasRole = Auth.hasRole(allowedRoles);
    return hasRole
        .then(has =>{
            if(has){
                // console.log('routerDecorator has role');
                return;
            }
            // console.log('routerDecorator has no role');

            event.preventDefault();

            if(fromState.name === ""){
                // first Route
                // Should redirect to default route

            }else {
                // Navigating inside application
                // Should return to previous route
                _$state.transitionTo(fromState.name);
            }
        });
};

function routerDecorator($rootScope, $state, PCAuth){
    Auth = PCAuth;
    _$state = $state;
    $rootScope.$on('$stateChangeStart', stateChangeHandler);

};


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__form__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = PCUserProvider;




let resourceProvider;
let _lodash;

class UserResourceConfig{
    constructor(){
        this.endpoint = '/api/users';
        this.paramDefaults = {
            'id' : '@id'
        };
        this.actions = {
            index:  {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT'
            },
            me: {
                method: 'GET',
                params: {
                    id: 'me'
                }
            }
        };
    };
}
/* unused harmony export UserResourceConfig */
;

/**
 * User resource class
 * responsible for user CRUD
 */
class UserResource{
    constructor({endpoint, paramDefaults, actions}, $resource){
        resourceProvider = $resource;
        this.resource = $resource(`${endpoint}/:id/:controller`, paramDefaults, actions);
    }

    /**
     * Pushes error messages to an angular form
     * @param   {object}    $form   the reference of the form
     * @return  {function}
     */
    errorHandler($form){
        return __WEBPACK_IMPORTED_MODULE_0__form__["a" /* default */].pushValidationMessageToForm($form);
    }

    /**
     * Get a lit of users
     * @param   {object}(optional)  query   additional query
     * @return  {Promise}
     */
    index(query = {}){
        return this.resource.index(query);
    }

    /**
     * Get a user
     * @param   {object}    query   additional query
     * @return  {Promise}
     */
    get(query = {}){
        return this.resource.get(query);
    }

    /**
     * Get the current user
     * @return {Promise}
     */
    me(){
        return this.resource.me();
    }

    /**
     * Deletes an item
     * @param   {object}            data    user data
     * @param   {array}(optional)   list    list of users we will get out the user object from
     * @return  {Promise}
     */
    delete(data, ...parameters){
        let instance = data && typeof data === 'object' && data.hasOwnProperty('$delete') ?
            data : new this.resource(data),
            list = Array.isArray(parameters[0]) ? parameters[0] : undefined;

        return instance.$delete({id: instance.id}, function(){
            if(typeof list !== undefined){
                let index = _lodash.findIndex(list, {id: instance.id});
                if(index > -1){ list.splice(index, 1); }
            }
        }, this.errorHandler());
    }

    /**
     * Saves an item
     * If data object has an id, it will consider the request as an update,
     * if id not provided, then it will be a create request
     * @param   {object}            data    user dtata
     * @param   {array}(optional)   list    list of users we manipulate after the request
     * @param   {object}(optional)  $form   angular form we will push error messages into
     * @return  {Promise}
     */
    save(data, ...parameters){

        let list = undefined,
            $form = undefined,
            instance = new this.resource(data);

        parameters.forEach(function(param){
            if(param !== null && typeof param === 'object'){
                $form = param;
            }
            if(param !== null && Array.isArray(param)){
                list = param;
            }
        });

        if(instance.id){
            return instance.$update({id:instance.id}, function(result){
                if(list !== undefined){
                    let index = _lodash.findIndex(list, {id: instance.id});
                    if(index > -1){ list.splice(index, 1, result); }
                }
            }, this.errorHandler($form));
        }else{
            return instance.$save(function(result){
                if(list !== undefined){
                    list.push(result);
                }
            }, this.errorHandler($form));
        }
    }
}
/* unused harmony export UserResource */
;

/**
 * User Resource Provider
 * @return Angular Provider
 */
function PCUserProvider(){

    let self = this;

    self.config = new UserResourceConfig();

    this.$get = function($resource, lodash)
    {
        _lodash = lodash;
        return new UserResource(self.config, $resource);
    };

};


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_auth_provider__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_interceptor_provider__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_user_provider__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_router_decorator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_role_restrict_directive__ = __webpack_require__(4);









const MODULE_NAME = 'popcode-kit.auth';
let dependencies = ['ngCookies', 'ui.router', 'ngResource', 'ngLodash',
    'angular-jwt'];

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__src_utils__["a" /* checkModulesLoaded */])(dependencies);

function addInterceptor($httpProvider) {
  $httpProvider.interceptors.push('PCAuthInterceptor');
}

angular.module(MODULE_NAME, dependencies)
    .provider('PCAuthInterceptor', __WEBPACK_IMPORTED_MODULE_2__src_interceptor_provider__["a" /* PCAuthInterceptorProvider */])
    .run(__WEBPACK_IMPORTED_MODULE_4__src_router_decorator__["a" /* routerDecorator */])
    .provider('PCAuth', __WEBPACK_IMPORTED_MODULE_1__src_auth_provider__["a" /* PCAuthProvider */])
    .provider('PCUser', __WEBPACK_IMPORTED_MODULE_3__src_user_provider__["a" /* PCUserProvider */])
    .directive('pcRoleRestrict', __WEBPACK_IMPORTED_MODULE_5__src_role_restrict_directive__["a" /* roleRestrictConfig */])
    .config(['$httpProvider', addInterceptor])
    .name
    ;


/***/ })
/******/ ]);