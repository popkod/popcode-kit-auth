'use strict';

export function routerDecorator($rootScope, StateCHangeHandlerProvider){
    $rootScope.$on('$stateChangeStart', StateCHangeHandlerProvider.handleNavigation);

}
