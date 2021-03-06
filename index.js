'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import uiRouter from 'angular-ui-router';
import angularResource from 'angular-resource';
import ngLodash from 'ng-lodash';
import angularJWT from 'angular-jwt';

import {checkModulesLoaded} from './src/utils';
import {PCAuthProvider} from './src/auth.provider';
import {PCAuthInterceptorProvider} from './src/interceptor.provider';
import {PCUserProvider} from './src/user.provider';
import {routerDecorator} from './src/router.decorator';
import {roleRestrictConfig, RoleRestricter} from './src/role-restrict.directive';

const MODULE_NAME = 'popcode-kit.auth';
let dependencies = [ngCookies, uiRouter, angularResource, 'ngLodash',
    angularJWT];

// checkModulesLoaded(dependencies);

function addInterceptor($httpProvider) {
  $httpProvider.interceptors.push('PCAuthInterceptor');
}

angular.module('popcode-kit.auth', dependencies)
    .provider('PCAuthInterceptor', PCAuthInterceptorProvider)
    .run(routerDecorator)
    .provider('PCAuth', PCAuthProvider)
    .provider('PCUser', PCUserProvider)
    .directive('pcRoleRestrict', roleRestrictConfig)
    .config(['$httpProvider', addInterceptor])
    ;

export default 'popcode-kit.auth';
