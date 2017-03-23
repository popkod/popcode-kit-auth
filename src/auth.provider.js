'use strict';

import From from './form';
import {noop} from './utils';

let _PCUser,
    _$http,
    _$timeout,
    _lodash,
    _$q
    ;

export class User{

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
};

/**
 * Default configuration Object
 */
export class AuthConfig{
    constructor(){
        this.endpoint = '/api/';
    }
};

/**
 * Auth Class
 */
export class Auth{

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
        return From.pushValidationMessageToForm($form, reject);
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

    hasRole(roles){
        return this._me
            .then(me => {
                return me.hasRole(roles);
            })
    }

};

/**
 * PCAuth Provider
 */
export function PCAuthProvider(){

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
