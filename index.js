'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import uiRouter from 'angular-ui-router';
import angularResource from 'angular-resource';
import ngLodash from 'ng-lodash';
import angularJWT from 'angular-jwt';

import {checkModulesLoaded} from './src/utils';
import {PCAuthProvider} from './src/auth.provider';
import {StateCHangeHandlerProvider} from './src/state-change-handler.provider';
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

angular.module(MODULE_NAME, dependencies)
    .provider('PCAuthInterceptor', PCAuthInterceptorProvider)
    .provider('StateCHangeHandlerProvider', StateCHangeHandlerProvider)
    .run(routerDecorator)
    .provider('PCAuth', PCAuthProvider)
    .provider('PCUser', PCUserProvider)
    .directive('pcRoleRestrict', roleRestrictConfig)
    .config(['$httpProvider', addInterceptor])
    ;

export default MODULE_NAME;
