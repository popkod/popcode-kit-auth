'use strict';

import {noop} from './utils';

export class responseErrorHandlers{

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

};

export class InterceptorConfig{

    constructor(){
        this.responseErrorHandlers = new responseErrorHandlers;
    };

};

export class AuthInterceptor{

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

};

export function PCAuthInterceptorProvider(){

    let self = this;

    self.config = new InterceptorConfig();

    self.$get = function(){
        return new AuthInterceptor(self.config );
    };

};
