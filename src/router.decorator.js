'use strict';

let Auth;

function handleConfigError(stateName, role){
    console.error(
        `Error:\n
        Invalid restrict value provided in ${stateName}.\n
        It should be either number or array of numbers.\n
        ${typeof role} given.`);
        return;
}

export function stateChangeHandler(event, nextState, nextParams, fromState,
        fromParams){

    // console.log('routerDecorator', nextState, fromState);
    if(!nextState.restrict){
        // console.log('routerDecorator no need to check role');
        return;
    }

    // console.log('routerDecorator need to check role');

    let allowedRoles = [];

    if(typeof nextState.restrict === 'number'){
        allowedRoles.push(nextState.restrict);
    }else if (typeof nextState.restrict == 'string') {
        if(isNaN(nextState.restrict)){
            return handleConfigError(nextState.name, nextState.restrict);
        }
        allowedRoles.push(Number(nextState.restrict));
    } else if(Array.isArray(nextState.restrict)){
        allowedRoles = nextState.restrict;
    }else{
        return handleConfigError(nextState.name, nextState.restrict);
    }

    let hasRole = Auth.hasRole(allowedRoles);
    return hasRole
        .then(has =>{
            if(has){
                // console.log('routerDecorator has role');
                return;
            }
            // console.log('routerDecorator has no role');

            event.preventDefault();

            if(fromState.name === ""){
                // first Route
                // Should redirect to default route

            }else {
                // Navigating inside application
                // Should return to previous route
                $state.transitionTo(fromState.name);
            }
        });
};

export function routerDecorator($rootScope, $state, PCAuth){
    Auth = PCAuth;

    $rootScope.$on('$stateChangeStart', stateChangeHandler);

};
