'use strict';

import {noop} from './utils';

let
    _PCAuth,
    _$parse
    ;

/**
 * Shows an element via removing `ng-hide` class
 * @param   {Object}   element      jqLite element
 */
function show(element){
    element.removeClass('ng-hide');
}

/**
 * Hides an element via adding `ng-hide` class
 * @param   {Object}   element      jqLite element
 */
function hide(element){
    element.addClass('ng-hide');
}

/**
 * Link function of the directive
 * Compares the passed number or array of numbers
 * with the users role number.
 * If the array contains the user's role, or the given number equals to
 * it, then it makes the element visible, otherwise hidden.
 */
export function RoleRestricterLink($scope, element, attrs, controller,
        transclude) {

    transclude($scope, function (clone) {
        element.append(clone);
    });

    let
        me,
        watcher = noop,
        roles = _$parse(attrs.pcRoleRestrict)($scope);

    //First hide the element
    hide(element);


    _PCAuth.hasRole(roles)
        // When the user resolved, it comperses the roles
        .then(has => {
            (has ? show : hide)(element);
        })
        .catch(function(){
            show(element);
        })

    element.on('$destroy', function(){
        // Clean up $scope watcher
        watcher();
    });
};

export function roleRestrictConfig(PCAuth, $parse) {

    _PCAuth = PCAuth;
    _$parse = $parse;

    return {
        restict: 'E',
        transclude: true,
        scope: {
            restrict: '&pcRoleRestrict'
        },
        link: RoleRestricterLink
    };
};
