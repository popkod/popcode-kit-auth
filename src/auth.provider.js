'use strict';

import From from './form';
import {noop} from './utils';

let _PCUser,
    _$http,
    _$timeout,
    _lodash,
    _$q,
    _$cookies
    ;

export class User{

    // constructor({id, name, email, role, meta, roleObject, token}){
    //     this.name = name || '';
    //     this.email = email || '';
    //     this.role = role;
    //     this.role_object = roleObject || {};
    //     this.meta = meta || {};
    //     this.token = token;
    // };
    constructor(data){
        let user = this;

        this.name = data.name || '';
        this.email = data.email || '';
        this.role = data.role;
        this.role_object = data.roleObject || {};
        this.meta = data.meta || {};
        this.token = data.token;

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
        this.statusChangeCallbacks = [];
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
                        resolve({});
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
     * Log in the current user
     * @param   {Object}            data    user data
     * @param   {Object}(optional)  $form   Angular form, what should be
     *                                      filled with error messeges
     * @return  {Promise}
     */
    login(data, $form){
        let auth = this;
        return new Promise(function(resolve, reject){
            return _$http
                .post(`${auth.config.endpoint}login`, data)
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
        return new Promise(function(resolve, reject){
            _$http.get(`${auth.config.endpoint}logout`)
            .then(response => {
                _$cookies.remove('token');
                auth._me = new User({});
                auth._runStatusChangeCallbacks(auth._me);
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
        //console.log('get token');
    }

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

};

/**
 * PCAuth Provider
 */
export function PCAuthProvider(){

    let self = this;

    self.config = new AuthConfig();

    self.$get = function(PCUser, $http, $timeout, $q, lodash, $cookies){
         _PCUser = PCUser;
         _$http = $http;
         _$timeout = $timeout;
         _$q = $q;
         _lodash = lodash;
         _$cookies = $cookies;
         return new Auth(self.config, PCUser);
     };
};
