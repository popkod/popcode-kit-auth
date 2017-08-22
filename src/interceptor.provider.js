'use strict';

import {noop} from './utils';

var _config,
    _$injector,
    _$cookies,
    _$q
    ;

export class responseErrorHandlers{

    constructor(){
        this[400] = function(data){
            // console.error('Error: 400', data);
        };
        this[401] = function(data){
            // console.error('Error: 401', data);
        };
        this[403] = function(data){
            // console.error('Error: 403', data);
        };
        this[404] = function(data){
            // console.error('Error: 403', data);
        };
        this[500] = function(data){
            // console.error('Error: 500', data);
        };
    }

}

export class InterceptorConfig{

    constructor(){
        this.responseErrorHandlers = new responseErrorHandlers();
    }

}

export class AuthInterceptor{

    constructor(config){
        _config = config;
    }

    request(config){
        config.headers = config.headers || {};
        if(_$cookies.get('token')) {
            config.headers.Authorization = `Bearer ${_$cookies.get('token')}`;
        }
        return config;
    }

    responseError(response){
        let handler = _config.responseErrorHandlers[response.status] || noop;
        handler(response.data, _$injector);
        return _$q.reject(response);
    }

}

export function PCAuthInterceptorProvider(){

    let self = this;

    self.config = new InterceptorConfig();

    self.$get = function($injector, $cookies, $q){
        _$injector = $injector;
        _$cookies = $cookies;
        _$q = $q;
        return new AuthInterceptor(self.config );
    };

}
