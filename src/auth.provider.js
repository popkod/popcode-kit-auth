'use strict';

import From from './form';
import {noop} from './utils';

let _PCUser,
    _$http,
    _$timeout,
    _lodash,
    _$q,
    _$cookies,
    _jwtHelper
    ;

export class User{
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
    }

    /**
     * Check if user had one of the provided roles
     * @param {Array<Number>|String|Number}    role  role or role list
     */
    hasRole(role){
        let roleList = [];

        if(role && Array.isArray(role)){
            roleList = role;
        }else if (role && typeof role === 'string') {
            roleList = [Number(role)];
        }else if(role && typeof role === 'number'){
            roleList = [role];
        }else{
            return true;
        }

        return roleList.indexOf(this.role) > -1;
    }

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

/**
 * Default configuration Object
 */
export class AuthConfig{
    constructor(){
        this.endpoint = '/api/';
        this.tokenRefreshEndpoint = '/refresh-token';
        this.onTokenExpiration = (auth) => {
            auth.refreshToken();
        };
    }
}

/**
 * Auth Class
 */
export class Auth{

    constructor(config){
        this.statusChangeCallbacks = [];
        this._authChecked = false;
        this.config = config;
        this._me = this._getMe();
        this._tokenChecker();
    }

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
    set me(){

    }

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

};

/**
 * PCAuth Provider
 */
export function PCAuthProvider(){

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
