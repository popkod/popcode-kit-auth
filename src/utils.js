'use strict';

export function checkModulesLoaded(moduleList){
    if(typeof angular === 'undefined'){
        throw new Error('ERROR: Angular is not defined. Please include it first.');
        return;
    }
    moduleList.forEach(module => {
        try {
            angular.module(module);
        } catch(err) {
            console.error(`Error: dependency ${module} not loaded.`);
        }
    });
};

export function noop(){};
