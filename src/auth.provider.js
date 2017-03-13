'use strict';

import From from './form';

let PCUserInstance;
let _$http;

export class User{

    constructor({id, name, email, role, meta, roleObject}){
        this.name = name || '';
        this.email = email || '';
        this.role = role;
        this.role_object = roleObject || {};
        this.meta = meta || {};
    };

    hasRole(role){
        return role == this.role;
    };
};

export class AuthConfig{
    constructor(){
        this.endpoint = '/api/login';
    }
};

export class Auth{

    constructor(config){
        this.config = config;
        this.currentUser = new User({});
    };

    errorHandler($form, reject){
        return From.pushValidationMessageToForm($form, reject);
    }

    login(data, $form){
        console.log('Auth login');
        let auth = this;
        return new Promise(function(resolve, reject){
            return _$http
                .post(auth.config.endpoint, data)
                .then(res => {
                    console.log('auth login ok', res.data);
                    auth.currentUser = new User(res.data);
                    return resolve(auth.currentUser);
                })
                .catch(auth.errorHandler($form, reject))
                ;
        });

    }

    logout(){
        console.log('Auth logout');
    }

    getCurrentUser(){
        console.log('Auth get current user');
    }

    isLoggedIn(){
        console.log('Auth is logged in');
    }

    hasRole(role){
        return this.currentUser.hasRole(role);
    }

    getToken(){
        console.log('get token');
    }

};

export function PCAuthProvider(){

    let self = this;

    self.config = new AuthConfig();

    console.log('Initiating Auth service');

     self.$get = function(PCUser, $http){
         PCUserInstance = PCUser;
         _$http = $http;
         return new Auth(self.config, PCUser);
     };
};
