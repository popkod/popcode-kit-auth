'use strict';

let PCUserInstance;
let _$http;

export class User{

    constructor({id, name, email, role, meta}){
        this.name = name;
        this.email = email;
        this.role = role;
        this.meta = meta;
    };

    hasRole(role){
        return role == this.role;
    };
};

export class AuthConfig{
    constructor(){
        this.loginUrl = '/api/login';
    }
};

export class Auth{

    constructor(config){
        this.config = config;
        this.currentUser = new User();
    };

    login(data){
        return _$http
            .post(this.config.loginUrl, data)
            .then(res => {
                this.currentUser = new User(res);
            })
            .catch(err => {

            })
            .$promise;
        console.log('Auth login');
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
         pCUser = PCUser;
         _$http = $http;
         return new Auth(self.config, PCUser);
     };
};
