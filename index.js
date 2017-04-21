'use strict';

import {checkModulesLoaded} from './src/utils';
import {PCAuthProvider} from './src/auth.provider';
import {PCAuthInterceptorProvider} from './src/interceptor.provider';
import {PCUserProvider} from './src/user.provider';
import {routerDecorator} from './src/router.decorator';
import {roleRestrictConfig, RoleRestricter} from './src/role-restrict.directive';

const MODULE_NAME = 'popcode-kit.auth';
let dependencies = ['ngCookies', 'ui.router', 'ngResource', 'ngLodash',
    'angular-jwt'];

checkModulesLoaded(dependencies);

function addInterceptor($httpProvider) {
  $httpProvider.interceptors.push('PCAuthInterceptor');
}

angular.module(MODULE_NAME, dependencies)
    .provider('PCAuthInterceptor', PCAuthInterceptorProvider)
    .run(routerDecorator)
    .provider('PCAuth', PCAuthProvider)
    .provider('PCUser', PCUserProvider)
    .directive('pcRoleRestrict', roleRestrictConfig)
    .config(['$httpProvider', addInterceptor])
    .name
    ;
