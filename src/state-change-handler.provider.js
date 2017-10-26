function handleConfigError(stateName, role) {
    console.error(`Error:\n
        Invalid restrict value provided in ${stateName}.\n
        It should be either number or array of numbers.\n
        ${typeof role} given.`);
    return;
}

function StateCHangeHandler($rootScope, $state, PCAuth, $window, config) {
    this.handleNavigation = (event, nextState, nextParams, fromState) => {
        if (!nextState.restrict) {
            return;
        }

        let allowedRoles = [];

        if (typeof nextState.restrict === 'number') {
            allowedRoles.push(nextState.restrict);
        } else if (typeof nextState.restrict === 'string') {
            if (isNaN(nextState.restrict)) {
                return handleConfigError(nextState.name, nextState.restrict);
            }
            allowedRoles.push(Number(nextState.restrict));
        } else if (Array.isArray(nextState.restrict)) {
            allowedRoles = nextState.restrict;
        } else {
            return handleConfigError(nextState.name, nextState.restrict);
        }

        let hasRole = PCAuth.hasRole(allowedRoles);
        return hasRole.then(has => {
            if (has) {
                return;
            }

            event.preventDefault();

            if (fromState.name === "") {
                // first Route
                // Should redirect to default route
                switch (typeof config.defaultRedirect) {
                    // redirect to a url
                    case 'string':
                        $window.location.href = config.defaultRedirect;
                    break;
                    // or let them handle it
                    case 'function':
                        config.defaultRedirect();
                    break;
                }

                // Else do nothing

            } else {
                // Navigating inside application
                // Should return to previous route
                $state.transitionTo(fromState.name);
            }
        });
    };
}

export function StateCHangeHandlerProvider() {
    this.defaultRedirect = '/';

    this.$get = ($rootScope, $state, PCAuth, $window) => {
        return new StateCHangeHandler($rootScope, $state, PCAuth, $window, {defaultRedirect: this.defaultRedirect});
    };
}
