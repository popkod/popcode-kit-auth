'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******/(function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/var installedModules = {};

    /******/ // The require function
    /******/function __webpack_require__(moduleId) {

        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId])
            /******/return installedModules[moduleId].exports;

        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
            /******/i: moduleId,
            /******/l: false,
            /******/exports: {}
            /******/ };

        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        /******/ // Flag the module as loaded
        /******/module.l = true;

        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
    }

    /******/ // expose the modules object (__webpack_modules__)
    /******/__webpack_require__.m = modules;

    /******/ // expose the module cache
    /******/__webpack_require__.c = installedModules;

    /******/ // identity function for calling harmony imports with the correct context
    /******/__webpack_require__.i = function (value) {
        return value;
    };

    /******/ // define getter function for harmony exports
    /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
            /******/Object.defineProperty(exports, name, {
                /******/configurable: false,
                /******/enumerable: true,
                /******/get: getter
                /******/ });
            /******/
        }
        /******/
    };

    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
            return module['default'];
        } :
        /******/function getModuleExports() {
            return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
    };

    /******/ // Object.prototype.hasOwnProperty.call
    /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };

    /******/ // __webpack_public_path__
    /******/__webpack_require__.p = "";

    /******/ // Load entry module and return exports
    /******/return __webpack_require__(__webpack_require__.s = 7);
    /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    __webpack_exports__["a"] = checkModulesLoaded;
    /* harmony export (immutable) */__webpack_exports__["b"] = noop;

    function checkModulesLoaded(moduleList) {
        if (typeof angular === 'undefined') {
            throw new Error('ERROR: Angular is not defined. Please include it first.');
            return;
        }
        moduleList.forEach(function (module) {
            try {
                angular.module(module);
            } catch (err) {
                console.error('Error: dependency ' + module + ' not loaded.');
            }
        });
    };

    function noop() {};

    /***/
},
/* 1 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);

    var Form = function () {
        function Form() {
            _classCallCheck(this, Form);
        }

        _createClass(Form, null, [{
            key: 'pushValidationMessageToForm',

            /**
             * Pushes error messages to an angular form
             * @param   {object}    $form   the reference of the form
             * @return  {function}
             */
            value: function pushValidationMessageToForm($form, reject) {
                return function (response) {
                    if ($form !== undefined && typeof $form.$setPristine == 'function') {
                        if (response.status == 400 && response.data.error) {
                            $form.general = {
                                $error: {}
                            };
                            if (typeof response.data.error == 'string') {
                                $form.general.$error.error = Array.isArray(response.data.error) ? response.data.error : [response.data.error];
                            } else {
                                Object.keys($form).forEach(function (key) {
                                    var value = response.data.error[key];
                                    if ($form[key] && $form[key].$error) $form[key].$error.error = value;
                                });
                            }
                        }
                    }
                    return (reject || __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* noop */])(response);
                };
            }
        }]);

        return Form;
    }();
    /* harmony export (immutable) */

    __webpack_exports__["a"] = Form;

    /***/
},
/* 2 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__form__ = __webpack_require__(1);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
    /* harmony export (immutable) */__webpack_exports__["a"] = PCAuthProvider;

    var _PCUser = void 0,
        _$http = void 0,
        _$timeout = void 0,
        _lodash = void 0,
        _$q = void 0,
        _$cookies = void 0,
        _jwtHelper = void 0;

    var User = function () {
        function User(data) {
            _classCallCheck(this, User);

            var user = this;

            this.name = data.name || '';
            this.email = data.email || '';
            this.role = data.role;
            this.role_object = data.roleObject || {};
            this.meta = data.meta || {};
            this.token = data.token;

            this.tokenExpirationHandled = false;

            Object.keys(data).forEach(function (key) {
                var patt = new RegExp(/^\$/);
                if (!patt.test(key)) {
                    user[key] = data[key];
                }
            });
        }

        _createClass(User, [{
            key: 'hasRole',


            /**
             * Check if user had one of the provided roles
             * @param {Array<Number>|String|Number}    role  role or role list
             */
            value: function hasRole(role) {
                var roleList = [];

                if (role && Array.isArray(role)) {
                    roleList = role;
                } else if (role && typeof role == 'string') {
                    roleList = [Number(role)];
                } else if (role && typeof role == 'number') {
                    roleList = [role];
                } else {
                    return true;
                }

                return roleList.indexOf(this.role) > -1;
            }
        }, {
            key: 'checkToken',


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
            value: function checkToken() {
                if (!this.token) {
                    return null;
                } else {
                    var expiration = _jwtHelper.getTokenExpirationDate(this.token);
                    var now = new Date();
                    var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
                    var difference = expiration - utc_timestamp;

                    // console.log(`Token will expire in ${difference / 1000} seconds`, `At ${expiration.toString()}`);
                    if (difference > 10 * 1000) {
                        return true;
                    } else if (difference < 10 * 1000 && difference >= 0) {
                        if (!this.tokenExpirationHandled) {
                            this.tokenExpirationHandled = true;
                            return -1;
                            return;
                        } else {
                            return -2;
                        }
                    } else {
                        if (this.tokenExpirationHandled && this.token) {
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

        }, {
            key: 'refresh',
            value: function refresh(token) {
                this.token = token;
                this.tokenExpirationHandled = false;
            }
        }]);

        return User;
    }();
    /* unused harmony export User */


    ;

    /**
     * Default configuration Object
     */

    var AuthConfig = function AuthConfig() {
        _classCallCheck(this, AuthConfig);

        this.endpoint = '/api/';
        this.tokenRefreshEndpoint = '/refresh-token';
        this.onTokenExpiration = function (auth) {
            auth.refreshToken();
        };
    };
    /* unused harmony export AuthConfig */


    ;

    /**
     * Auth Class
     */

    var Auth = function () {
        function Auth(config) {
            _classCallCheck(this, Auth);

            this.statusChangeCallbacks = [];
            this._authChecked = false;
            this.config = config;
            this._me = this._getMe();
            this._tokenChecker();
        }

        _createClass(Auth, [{
            key: 'errorHandler',


            /**
             * Handles form errors
             * @param   {Objec}                 $form   Angular form
             * @param   {Function}(optional)    reject  reject callback, what should be
             *                                  called after form error handling
             * @return  {Fuction}
             */
            value: function errorHandler($form, reject) {
                return __WEBPACK_IMPORTED_MODULE_0__form__["a" /* default */].pushValidationMessageToForm($form, reject);
            }

            /**
             * Get the current user data from the server
             * @return {Promise}    User object
             */

        }, {
            key: '_getMe',
            value: function _getMe() {
                // Actual request goes here:
                var _auth = this;
                return _$q(function (resolve, reject) {
                    if (_$cookies.get('token')) {
                        _PCUser.me().$promise.then(function (response) {
                            _auth._me = new User(response);
                            resolve(_auth._me);
                        }).catch(function (response) {
                            _$cookies.remove('token');
                            _auth._me = new User({});
                            resolve(_auth._me);
                        });
                    } else {
                        _auth._me = new User({});
                        resolve(_auth._me);
                    }
                });
            }

            /**
             * Add callback to the status change callback array
             */

        }, {
            key: '_addStatusChangeCallback',
            value: function _addStatusChangeCallback(cb) {
                var auth = this;
                if (typeof cb !== 'function') {
                    console.error('Status change callback must be a function. ' + (typeof cb === 'undefined' ? 'undefined' : _typeof(cb)) + ' given.');
                    return;
                }

                auth.statusChangeCallbacks.push(cb);
            }

            /**
             * Remove callback from the status change callback array
             */

        }, {
            key: '_removeStatusChangeCallback',
            value: function _removeStatusChangeCallback(cb) {
                var auth = this;
                var index = auth.statusChangeCallbacks.indexOf(cb);
                if (index > -1) {
                    auth.statusChangeCallbacks.splice(index, 1);
                } else {
                    console.warn('Calback could not found.');
                }
            }

            /**
             * Run status change callbacks
             */

        }, {
            key: '_runStatusChangeCallbacks',
            value: function _runStatusChangeCallbacks(me) {
                var auth = this;
                auth.statusChangeCallbacks.forEach(function (cb) {
                    cb(me);
                });
            }

            /**
             * Checks token on every seconds
             * @return {[type]} [description]
             */

        }, {
            key: '_tokenChecker',
            value: function _tokenChecker() {
                var _this = this;

                if (!this.tokenCheckerInterval) {
                    this.tokenCheckerInterval = setInterval(function () {
                        _this.me.then(function (me) {
                            var token = me.checkToken();
                            if (token === null) {
                                // No token
                            } else if (token === undefined) {
                                // No user
                            } else if (token === true) {
                                // Token OK
                            } else if (token === -1) {
                                // Token will expire need to handle
                                _this.config.onTokenExpiration(_this);
                            } else if (token === -2) {
                                // token will expire but already handled
                            } else if (token === -3) {
                                // token expired and not refreshed. Need to logout.
                                _this.logout();
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

        }, {
            key: 'login',
            value: function login(data, $form, route) {
                var auth = this;
                return new _$q(function (resolve, reject) {
                    return _$http.post('' + auth.config.endpoint + (route || 'login'), data).then(function (res) {
                        if (res.status === 200) {
                            _$cookies.put('token', res.data.token);
                            auth._me = new User(res.data);
                            auth._runStatusChangeCallbacks(auth._me);
                            return resolve(auth._me);
                        } else {
                            return auth.errorHandler($form, reject)(res);
                        }
                    }).catch(auth.errorHandler($form, reject));
                });
            }

            /**
             * Log out the current user
             * @return {Promise}
             */

        }, {
            key: 'logout',
            value: function logout() {
                var auth = this;
                return new _$q(function (resolve, reject) {
                    _$http.get(auth.config.endpoint + 'logout').then(function (response) {
                        resolve(response);
                    }).catch(function (response) {
                        console.warn('User logged out, but got error from API.', response);
                        resolve(response);
                    }).finally(function () {
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

        }, {
            key: 'refreshUser',
            value: function refreshUser(user) {
                var auth = this;
                if (user) {
                    auth._me = new User(user);
                } else {
                    auth._me = auth._getMe();
                }
                return auth.me.then(function (me) {
                    auth._runStatusChangeCallbacks(me);
                });
            }

            /**
             * Call for token refresh
             * @return {Promise} $q promise
             */

        }, {
            key: 'refreshToken',
            value: function refreshToken() {
                var auth = this;
                return new _$q(function (resolve, reject) {
                    return _$http.get('' + auth.config.tokenRefreshEndpoint).then(function (res) {
                        if (res.status === 200) {
                            _$cookies.put('token', res.data.token);
                            auth._me.refresh(res.data.token);
                            auth._runStatusChangeCallbacks(auth._me);
                            return resolve(auth._me);
                        } else {
                            return reject(res);
                        }
                    }).catch(function (response) {
                        console.error(response);
                    });
                });
            }

            /**
             * Get the current user
             * @return {Promise}
             */

        }, {
            key: 'getToken',
            value: function getToken() {}
            //console.log('get token');


            /**
             * Checks if current user had roles
             * @param  {number|string|Array<number>}  roles [description]
             * @return {Boolean}       true if has
             */

        }, {
            key: 'hasRole',
            value: function hasRole(roles) {
                var value = _lodash.get(this._me, '$promise') ? this._me.$promise : this._me;
                return _$q.when(value).then(function (me) {
                    return me.hasRole(roles);
                });
            }

            /**
             * Add a callback which is called when user login status changes
             * Returns the remove function, so call it to deregister the specific
             * callback
             */

        }, {
            key: 'onStatusChange',
            value: function onStatusChange(cb) {
                var auth = this;
                auth._addStatusChangeCallback(cb);
                return function () {
                    auth._removeStatusChangeCallback(cb);
                };
            }
        }, {
            key: 'me',
            get: function get() {
                var value = _lodash.get(this._me, '$promise') ? this._me.$promise : this._me;
                return _$q.when(value);
            }

            /**
             * Modifying user object outside of the class is not allowed
             * @param {object}  me  user object what won't be used
             * @return void
             */
            ,
            set: function set(me) {}
        }]);

        return Auth;
    }();
    /* unused harmony export Auth */


    ;

    /**
     * PCAuth Provider
     */
    function PCAuthProvider() {

        var self = this;

        self.config = new AuthConfig();

        self.$get = function (PCUser, $http, $timeout, $q, lodash, $cookies, jwtHelper) {
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

    /***/
},
/* 3 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
    /* harmony export (immutable) */__webpack_exports__["a"] = PCAuthInterceptorProvider;

    var _config, _$injector, _$cookies, _$q;

    var responseErrorHandlers = function responseErrorHandlers() {
        _classCallCheck(this, responseErrorHandlers);

        this[400] = function (data) {
            // console.error('Error: 400', data);
        };
        this[401] = function (data) {
            // console.error('Error: 401', data);
        };
        this[403] = function (data) {
            // console.error('Error: 403', data);
        };
        this[404] = function (data) {
            // console.error('Error: 403', data);
        };
        this[500] = function (data) {
            // console.error('Error: 500', data);
        };
    };
    /* unused harmony export responseErrorHandlers */


    ;

    var InterceptorConfig = function InterceptorConfig() {
        _classCallCheck(this, InterceptorConfig);

        this.responseErrorHandlers = new responseErrorHandlers();
    };
    /* unused harmony export InterceptorConfig */


    ;

    var AuthInterceptor = function () {
        function AuthInterceptor(config) {
            _classCallCheck(this, AuthInterceptor);

            //console.log('Initiating AuthInterceptor', this);
            _config = config;
        }

        _createClass(AuthInterceptor, [{
            key: 'request',
            value: function request(config) {
                //console.log('AuthInterceptor', 'request');
                config.headers = config.headers || {};
                if (_$cookies.get('token')) {
                    //console.log(`Bearer ${_$cookies.get('token')}`);
                    config.headers.Authorization = 'Bearer ' + _$cookies.get('token');
                }
                return config;
            }
        }, {
            key: 'responseError',
            value: function responseError(response) {
                // console.error('AuthInterceptor', 'responseError', response);
                var handler = _config.responseErrorHandlers[response.status] || __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* noop */];
                handler(response.data, _$injector);
                return _$q.reject(response);
                // return response;
            }
        }]);

        return AuthInterceptor;
    }();
    /* unused harmony export AuthInterceptor */


    ;

    function PCAuthInterceptorProvider() {

        var self = this;

        self.config = new InterceptorConfig();

        self.$get = function ($injector, $cookies, $q) {
            _$injector = $injector;
            _$cookies = $cookies;
            _$q = $q;
            return new AuthInterceptor(self.config);
        };
    };

    /***/
},
/* 4 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
    /* unused harmony export RoleRestricterLink */
    /* harmony export (immutable) */__webpack_exports__["a"] = roleRestrictConfig;

    var _PCAuth = void 0,
        _$parse = void 0;

    /**
     * Shows an element via removing `ng-hide` class
     * @param   {Object}   element      jqLite element
     */
    function show(element) {
        element.removeClass('ng-hide');
    }

    /**
     * Hides an element via adding `ng-hide` class
     * @param   {Object}   element      jqLite element
     */
    function hide(element) {
        element.addClass('ng-hide');
    }

    /**
     * Link function of the directive
     * Compares the passed number or array of numbers
     * with the users role number.
     * If the array contains the user's role, or the given number equals to
     * it, then it makes the element visible, otherwise hidden.
     */
    function RoleRestricterLink($scope, element, attrs, controller, transclude) {

        transclude($scope, function (clone) {
            element.append(clone);
        });

        var me = void 0,
            watcher = __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* noop */],
            roles = _$parse(attrs.pcRoleRestrict)($scope);

        //First hide the element
        hide(element);

        _PCAuth.hasRole(roles)
        // When the user resolved, it comperses the roles
        .then(function (has) {
            (has ? show : hide)(element);
        }).catch(function () {
            show(element);
        });

        element.on('$destroy', function () {
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

    /***/
},
/* 5 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* unused harmony export stateChangeHandler */
    /* harmony export (immutable) */
    __webpack_exports__["a"] = routerDecorator;

    var Auth = void 0,
        _$state = void 0;

    function handleConfigError(stateName, role) {
        console.error('Error:\n\n        Invalid restrict value provided in ' + stateName + '.\n\n        It should be either number or array of numbers.\n\n        ' + (typeof role === 'undefined' ? 'undefined' : _typeof(role)) + ' given.');
        return;
    }

    function stateChangeHandler(event, nextState, nextParams, fromState, fromParams) {

        // console.log('routerDecorator', nextState, fromState);
        if (!nextState.restrict) {
            // console.log('routerDecorator no need to check role');
            return;
        }

        // console.log('routerDecorator need to check role');

        var allowedRoles = [];

        if (typeof nextState.restrict === 'number') {
            allowedRoles.push(nextState.restrict);
        } else if (typeof nextState.restrict == 'string') {
            if (isNaN(nextState.restrict)) {
                return handleConfigError(nextState.name, nextState.restrict);
            }
            allowedRoles.push(Number(nextState.restrict));
        } else if (Array.isArray(nextState.restrict)) {
            allowedRoles = nextState.restrict;
        } else {
            return handleConfigError(nextState.name, nextState.restrict);
        }

        var hasRole = Auth.hasRole(allowedRoles);
        return hasRole.then(function (has) {
            if (has) {
                // console.log('routerDecorator has role');
                return;
            }
            // console.log('routerDecorator has no role');

            event.preventDefault();

            if (fromState.name === "") {
                // first Route
                // Should redirect to default route

            } else {
                // Navigating inside application
                // Should return to previous route
                _$state.transitionTo(fromState.name);
            }
        });
    };

    function routerDecorator($rootScope, $state, PCAuth) {
        Auth = PCAuth;
        _$state = $state;
        $rootScope.$on('$stateChangeStart', stateChangeHandler);
    };

    /***/
},
/* 6 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__form__ = __webpack_require__(1);
    /* harmony export (immutable) */__webpack_exports__["a"] = PCUserProvider;

    var resourceProvider = void 0;
    var _lodash = void 0;

    var UserResourceConfig = function UserResourceConfig() {
        _classCallCheck(this, UserResourceConfig);

        this.endpoint = '/api/users';
        this.paramDefaults = {
            'id': '@id'
        };
        this.actions = {
            index: {
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
    /* unused harmony export UserResourceConfig */


    ;

    /**
     * User resource class
     * responsible for user CRUD
     */

    var UserResource = function () {
        function UserResource(_ref, $resource) {
            var endpoint = _ref.endpoint,
                paramDefaults = _ref.paramDefaults,
                actions = _ref.actions;

            _classCallCheck(this, UserResource);

            resourceProvider = $resource;
            this.resource = $resource(endpoint + '/:id/:controller', paramDefaults, actions);
        }

        /**
         * Pushes error messages to an angular form
         * @param   {object}    $form   the reference of the form
         * @return  {function}
         */


        _createClass(UserResource, [{
            key: 'errorHandler',
            value: function errorHandler($form) {
                return __WEBPACK_IMPORTED_MODULE_0__form__["a" /* default */].pushValidationMessageToForm($form);
            }

            /**
             * Get a lit of users
             * @param   {object}(optional)  query   additional query
             * @return  {Promise}
             */

        }, {
            key: 'index',
            value: function index() {
                var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return this.resource.index(query);
            }

            /**
             * Get a user
             * @param   {object}    query   additional query
             * @return  {Promise}
             */

        }, {
            key: 'get',
            value: function get() {
                var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return this.resource.get(query);
            }

            /**
             * Get the current user
             * @return {Promise}
             */

        }, {
            key: 'me',
            value: function me() {
                return this.resource.me();
            }

            /**
             * Deletes an item
             * @param   {object}            data    user data
             * @param   {array}(optional)   list    list of users we will get out the user object from
             * @return  {Promise}
             */

        }, {
            key: 'delete',
            value: function _delete(data) {
                var instance = data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data.hasOwnProperty('$delete') ? data : new this.resource(data),
                    list = Array.isArray(arguments.length <= 1 ? undefined : arguments[1]) ? arguments.length <= 1 ? undefined : arguments[1] : undefined;

                return instance.$delete({ id: instance.id }, function () {
                    if ((typeof list === 'undefined' ? 'undefined' : _typeof(list)) !== undefined) {
                        var index = _lodash.findIndex(list, { id: instance.id });
                        if (index > -1) {
                            list.splice(index, 1);
                        }
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

        }, {
            key: 'save',
            value: function save(data) {

                var list = undefined,
                    $form = undefined,
                    instance = new this.resource(data);

                for (var _len = arguments.length, parameters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    parameters[_key - 1] = arguments[_key];
                }

                parameters.forEach(function (param) {
                    if (param !== null && (typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
                        $form = param;
                    }
                    if (param !== null && Array.isArray(param)) {
                        list = param;
                    }
                });

                if (instance.id) {
                    return instance.$update({ id: instance.id }, function (result) {
                        if (list !== undefined) {
                            var index = _lodash.findIndex(list, { id: instance.id });
                            if (index > -1) {
                                list.splice(index, 1, result);
                            }
                        }
                    }, this.errorHandler($form));
                } else {
                    return instance.$save(function (result) {
                        if (list !== undefined) {
                            list.push(result);
                        }
                    }, this.errorHandler($form));
                }
            }
        }]);

        return UserResource;
    }();
    /* unused harmony export UserResource */


    ;

    /**
     * User Resource Provider
     * @return Angular Provider
     */
    function PCUserProvider() {

        var self = this;

        self.config = new UserResourceConfig();

        this.$get = function ($resource, lodash) {
            _lodash = lodash;
            return new UserResource(self.config, $resource);
        };
    };

    /***/
},
/* 7 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__src_utils__ = __webpack_require__(0);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__src_auth_provider__ = __webpack_require__(2);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__src_interceptor_provider__ = __webpack_require__(3);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__src_user_provider__ = __webpack_require__(6);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__src_router_decorator__ = __webpack_require__(5);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__src_role_restrict_directive__ = __webpack_require__(4);

    var MODULE_NAME = 'popcode-kit.auth';
    var dependencies = ['ngCookies', 'ui.router', 'ngResource', 'ngLodash', 'angular-jwt'];

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__src_utils__["a" /* checkModulesLoaded */])(dependencies);

    function addInterceptor($httpProvider) {
        $httpProvider.interceptors.push('PCAuthInterceptor');
    }

    angular.module(MODULE_NAME, dependencies).provider('PCAuthInterceptor', __WEBPACK_IMPORTED_MODULE_2__src_interceptor_provider__["a" /* PCAuthInterceptorProvider */]).run(__WEBPACK_IMPORTED_MODULE_4__src_router_decorator__["a" /* routerDecorator */]).provider('PCAuth', __WEBPACK_IMPORTED_MODULE_1__src_auth_provider__["a" /* PCAuthProvider */]).provider('PCUser', __WEBPACK_IMPORTED_MODULE_3__src_user_provider__["a" /* PCUserProvider */]).directive('pcRoleRestrict', __WEBPACK_IMPORTED_MODULE_5__src_role_restrict_directive__["a" /* roleRestrictConfig */]).config(['$httpProvider', addInterceptor]).name;

    /***/
}]);
//# sourceMappingURL=boundle.js.map
