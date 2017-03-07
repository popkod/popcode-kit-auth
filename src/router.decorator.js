'use strict';

let Auth;

export function stateChangeHandler(event, nextState){

    if(!nextState.restrict){
        return;
    }

    let allowedRoles = [];

    if(typeof nextState.restrict === 'number'){
        allowedRoles.push(nextState.restrict);
    } else if(typeof nextState.restrict === 'Array'){
        allowedRoles = nextState.restrict;
    }else{
        console.error(
            `Error:\n
            Invalid restrict value provided in ${nextState.name}.\n
            It should be either number or array of numbers.\n
            ${typeof nextState.restrict} given.`);
        return;
    }

    Auth.hasRole(allowedRoles)
        .then(has =>{
            if(has){
                return;
            }

            event.preventDefault();
        });
};

export function routerDecorator($rootScope, $state, PCAuth){
    Auth = PCAuth;

    $rootScope.$on('$stateChangeStart', stateChangeHandler);

};
