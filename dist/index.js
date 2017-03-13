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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
            (reject || __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* noop */])(response);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Form;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__form__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = PCAuthProvider;




let _PCUser,
    _$http,
    _$timeout,
    _lodash,
    _$q
    ;

class User{

    constructor({id, name, email, role, meta, roleObject}){
        this.name = name || '';
        this.email = email || '';
        this.role = role;
        this.role_object = roleObject || {};
        this.meta = meta || {};
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
}
/* unused harmony export User */
;

/**
 * Default configuration Object
 */
class AuthConfig{
    constructor(){
        this.endpoint = '/api/';
    }
}
/* unused harmony export AuthConfig */
;

/**
 * Auth Class
 */
class Auth{

    constructor(config){
        this._authChecked = false;
        this.config = config;
        this._me = this._getMe();
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
        // For test only
        function _meMock(){
            return _$q(function(resolve){
                _$timeout(function(){
                    resolve({
                        name: 'Test User',
                        email: 'test@popcode.hu',
                        role: 1,
                        role_object: {
                            label: 'user',
                            title: 'Simple User',
                            id: 1
                        }
                    });
                }, 700);
            });
        }

        // Actual request goes here:
        let _auth = this;
        return _$q(function(resolve, reject){
            // _PCUser.me().$promise
                _meMock()
                .then(function(response){
                    _auth._me = new User(response);
                    resolve(_auth._me);
                })
                .catch(function(response){
                    resolve({});
                });
        });
    }

    /**
     * Log in the current user
     * @param   {Object}            data    user data
     * @param   {Object}(optional)  $form   Angular form, what should be
     *                                      filled with error messeges
     * @return  {Promise}
     */
    login(data, $form){
        console.log('Auth login');
        let auth = this;
        return new Promise(function(resolve, reject){
            return _$http
                .post(`${auth.config.endpoint}login`, data)
                .then(res => {
                    console.log('auth login ok', res.data);
                    auth._me = new User(res.data);
                    return resolve(auth._me);
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
        let _auth = this;
        return new Promise(function(resolve, reject){
            _http.get(`${auth.config.endpoint}logout`)
            .then(response => {
                _auth._me = {};
                resolve(response);
            })
            .catch(response => {
                reject(response);
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
        console.log('get token');
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

    self.$get = function(PCUser, $http, $timeout, $q, lodash){
         _PCUser = PCUser;
         _$http = $http;
         _$timeout = $timeout;
         _$q = $q;
         _lodash = lodash;
         return new Auth(self.config, PCUser);
     };
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* unused harmony export PCAuthInterceptorProvider */




class responseErrorHandlers{

    constructor(){
        this[400] = function(data){
            console.error('Error: 400', data);
        };
        this[401] = function(data){
            console.error('Error: 401', data);
        };
        this[403] = function(data){
            console.error('Error: 403', data);
        };
        this[404] = function(data){
            console.error('Error: 403', data);
        };
        this[500] = function(data){
            console.error('Error: 500', data);
        };
    }

}
/* unused harmony export responseErrorHandlers */
;

class InterceptorConfig{

    constructor(){
        this.responseErrorHandlers = new responseErrorHandlers;
    };

}
/* unused harmony export InterceptorConfig */
;

class AuthInterceptor{

    constructor(config){
        this.config = config;
    };

    request(config){
        return config;
    };

    requestError(response){
        var handler = this.config.responseErrorHandlers[response.status];
        if(typeof handler === 'function'){
            handler(response.data);
        }
    };

}
/* unused harmony export AuthInterceptor */
;

function PCAuthInterceptorProvider(){

    let self = this;

    self.config = new InterceptorConfig();

    self.$get = function(){
        return new AuthInterceptor(self.config );
    };

};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export stateChangeHandler */
/* unused harmony export routerDecorator */


let Auth;

function stateChangeHandler(event, nextState){

    if(!nextState.restrict){
        return;
    }

    let allowedRoles = [];

    if(typeof nextState.restrict === 'number'){
        allowedRoles.push(nextState.restrict);
    } else if(typeof nextState.restrict === 'Array'){
        allowedRoles = nextState.restrict;
    }else{
        console.error(
            `Error:\n
            Invalid restrict value provided in ${nextState.name}.\n
            It should be either number or array of numbers.\n
            ${typeof nextState.restrict} given.`);
        return;
    }

    Auth.hasRole(allowedRoles)
        .then(has =>{
            if(has){
                return;
            }

            event.preventDefault();
        });
};

function routerDecorator($rootScope, $state, PCAuth){
    Auth = PCAuth;

    $rootScope.$on('$stateChangeStart', stateChangeHandler);

};


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_auth_provider__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_interceptor_provider__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_user_provider__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_router_decorator__ = __webpack_require__(4);








const MODULE_NAME = 'popcode-kit.auth';
let dependencies = ['ngCookies', 'ui.router', 'ngResource', 'ngLodash'];

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__src_utils__["a" /* checkModulesLoaded */])(dependencies);

function addInterceptor($httpProvider) {
  $httpProvider.interceptors.push('PCAuthInterceptor');
}

angular.module(MODULE_NAME, dependencies)
    // .provider('PCAuthInterceptor', PCAuthInterceptorProvider)
    // .run(routerDecorator)
    .provider('PCAuth', __WEBPACK_IMPORTED_MODULE_1__src_auth_provider__["a" /* PCAuthProvider */])
    .provider('PCUser', __WEBPACK_IMPORTED_MODULE_3__src_user_provider__["a" /* PCUserProvider */])
    // .config(['$httpProvider', addInterceptor])
    .name
    ;


/***/ })
/******/ ]);