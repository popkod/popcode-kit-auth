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
    /******/return __webpack_require__(__webpack_require__.s = 5);
    /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    __webpack_exports__["a"] = checkModulesLoaded;
    /* unused harmony export noop */

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
    /* unused harmony export PCAuthProvider */

    var PCUserInstance = void 0;
    var _$http = void 0;

    var User = function () {
        function User(_ref) {
            var id = _ref.id,
                name = _ref.name,
                email = _ref.email,
                role = _ref.role,
                meta = _ref.meta;

            _classCallCheck(this, User);

            this.name = name;
            this.email = email;
            this.role = role;
            this.meta = meta;
        }

        _createClass(User, [{
            key: 'hasRole',
            value: function hasRole(role) {
                return role == this.role;
            }
        }]);

        return User;
    }();
    /* unused harmony export User */


    ;

    var AuthConfig = function AuthConfig() {
        _classCallCheck(this, AuthConfig);

        this.loginUrl = '/api/login';
    };
    /* unused harmony export AuthConfig */


    ;

    var Auth = function () {
        function Auth(config) {
            _classCallCheck(this, Auth);

            this.config = config;
            this.currentUser = new User();
        }

        _createClass(Auth, [{
            key: 'login',
            value: function login(data) {
                var _this = this;

                return _$http.post(this.config.loginUrl, data).then(function (res) {
                    _this.currentUser = new User(res);
                }).catch(function (err) {}).$promise;
                console.log('Auth login');
            }
        }, {
            key: 'logout',
            value: function logout() {
                console.log('Auth logout');
            }
        }, {
            key: 'getCurrentUser',
            value: function getCurrentUser() {
                console.log('Auth get current user');
            }
        }, {
            key: 'isLoggedIn',
            value: function isLoggedIn() {
                console.log('Auth is logged in');
            }
        }, {
            key: 'hasRole',
            value: function hasRole(role) {
                return this.currentUser.hasRole(role);
            }
        }, {
            key: 'getToken',
            value: function getToken() {
                console.log('get token');
            }
        }]);

        return Auth;
    }();
    /* unused harmony export Auth */


    ;

    function PCAuthProvider() {

        var self = this;

        self.config = new AuthConfig();

        console.log('Initiating Auth service');

        self.$get = function (PCUser, $http) {
            pCUser = PCUser;
            _$http = $http;
            return new Auth(self.config, PCUser);
        };
    };

    /***/
},
/* 2 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
    /* unused harmony export PCAuthInterceptorProvider */

    var responseErrorHandlers = function responseErrorHandlers() {
        _classCallCheck(this, responseErrorHandlers);

        this[400] = function (data) {
            console.error('Error: 400', data);
        };
        this[401] = function (data) {
            console.error('Error: 401', data);
        };
        this[403] = function (data) {
            console.error('Error: 403', data);
        };
        this[404] = function (data) {
            console.error('Error: 403', data);
        };
        this[500] = function (data) {
            console.error('Error: 500', data);
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

            this.config = config;
        }

        _createClass(AuthInterceptor, [{
            key: 'request',
            value: function request(config) {
                return config;
            }
        }, {
            key: 'requestError',
            value: function requestError(response) {
                var handler = this.config.responseErrorHandlers[response.status];
                if (typeof handler === 'function') {
                    handler(response.data);
                }
            }
        }]);

        return AuthInterceptor;
    }();
    /* unused harmony export AuthInterceptor */


    ;

    function PCAuthInterceptorProvider() {

        var self = this;

        self.config = new InterceptorConfig();

        self.$get = function () {
            return new AuthInterceptor(self.config);
        };
    };

    /***/
},
/* 3 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* unused harmony export stateChangeHandler */
    /* unused harmony export routerDecorator */

    var Auth = void 0;

    function stateChangeHandler(event, nextState) {

        if (!nextState.restrict) {
            return;
        }

        var allowedRoles = [];

        if (typeof nextState.restrict === 'number') {
            allowedRoles.push(nextState.restrict);
        } else if (typeof nextState.restrict === 'Array') {
            allowedRoles = nextState.restrict;
        } else {
            console.error('Error:\n\n            Invalid restrict value provided in ' + nextState.name + '.\n\n            It should be either number or array of numbers.\n\n            ' + _typeof(nextState.restrict) + ' given.');
            return;
        }

        Auth.hasRole(allowedRoles).then(function (has) {
            if (has) {
                return;
            }

            event.preventDefault();
        });
    };

    function routerDecorator($rootScope, $state, PCAuth) {
        Auth = PCAuth;

        $rootScope.$on('$stateChangeStart', stateChangeHandler);
    };

    /***/
},
/* 4 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    __webpack_exports__["a"] = PCUserProvider;

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

    var UserResource = function () {
        function UserResource(_ref2, $resource) {
            var endpoint = _ref2.endpoint,
                paramDefaults = _ref2.paramDefaults,
                actions = _ref2.actions;

            _classCallCheck(this, UserResource);

            resourceProvider = $resource;
            this.resource = $resource(endpoint + '/:id/:controller', paramDefaults, actions);
        }

        _createClass(UserResource, [{
            key: 'errorHandler',
            value: function errorHandler($form) {
                return function (response) {
                    console.error(response);
                    if ($form) {
                        if (response.status == 400 && response.data.error) {
                            Object.keys(response.data.error).forEach(function (key) {
                                var value = response.data.error[key];
                                console.log(key, value);
                                $form[key].$error.error = value;
                            });
                        }
                        console.log('a', $form);
                    }
                };
            }
        }, {
            key: 'index',
            value: function index() {
                return this.resource.index();
            }
        }, {
            key: 'get',
            value: function get(query) {
                return this.resource.get(query);
            }
        }, {
            key: 'delete',
            value: function _delete(userInstance, userList) {
                return userInstance.$delete({ id: userInstance.id }, function () {
                    if (userList) {
                        var index = _lodash.findIndex(userList, { id: userInstance.id });
                        if (index > -1) {
                            userList.splice(index, 1);
                        }
                    }
                }, this.errorHandler);
            }
        }, {
            key: 'save',
            value: function save(data, userList, $form) {
                var instance = new this.resource(data);
                if (instance.id) {
                    return instance.$update({ id: data.id }, function (result) {
                        if (userList) {
                            var index = _lodash.findIndex(userList, { id: instance.id });
                            if (index > -1) {
                                userList.splice(index, 1, result);
                            }
                        }
                    }, this.errorHandler($form));
                } else {
                    return instance.$save(function (result) {
                        if (userList) {
                            userList.push(result);
                        }
                    }, this.errorHandler($form));
                }
            }
        }]);

        return UserResource;
    }();
    /* unused harmony export UserResource */


    ;

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
/* 5 */
/***/function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__src_utils__ = __webpack_require__(0);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__src_auth_provider__ = __webpack_require__(1);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__src_interceptor_provider__ = __webpack_require__(2);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__src_user_provider__ = __webpack_require__(4);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__src_router_decorator__ = __webpack_require__(3);

    var MODULE_NAME = 'popcode-kit.auth';
    var dependencies = ['ngCookies', 'ui.router', 'ngResource', 'ngLodash'];

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__src_utils__["a" /* checkModulesLoaded */])(dependencies);

    function addInterceptor($httpProvider) {
        $httpProvider.interceptors.push('PCAuthInterceptor');
    }

    angular.module(MODULE_NAME, dependencies)
    // .provider('PCAuthInterceptor', PCAuthInterceptorProvider)
    // .run(routerDecorator)
    // .provider('PCAuth', PCAuthProvider)
    .provider('PCUser', __WEBPACK_IMPORTED_MODULE_3__src_user_provider__["a" /* PCUserProvider */])
    // .config(['$httpProvider', addInterceptor])
    .name;

    /***/
}]);
//# sourceMappingURL=boundle.js.map
