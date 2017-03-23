'use strict';

import {noop} from './utils';

var _config, _$injector;

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
        this.responseErrorHandlers = new responseErrorHandlers();
    };

};

export class AuthInterceptor{

    constructor(config){
        console.log('Initiating AuthInterceptor', this);
        _config = config;
    };

    request(config){
        console.log('AuthInterceptor', 'request');
        return config;
    };

    responseError(response){
        console.log('AuthInterceptor', 'responseError');
        let $state = _$injector.get('$state');
        console.log('$state', $state);
        let handler = _config.responseErrorHandlers[response.status] || noop;
        handler(response.data, _$injector);
        return response;
    };

};

export function PCAuthInterceptorProvider(){

    let self = this;

    self.config = new InterceptorConfig();

    self.$get = function($injector){
        _$injector = $injector;
        return new AuthInterceptor(self.config );
    };

};
