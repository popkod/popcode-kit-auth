'use strict';

let resource;

export class UserResourceConfig{
    constructor(){
        this.endpoint = '/api/users';
        this.paramDefaults = {};
        this.actions = {
            index:  {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT'
            },
            me: {
                method: 'GET',
                params: {
                    id: 'me'
                }
            }
        };
    };
};

export class UserResource{
    constructor({endpoint, paramDefaults, actions}, $resource){
        resource = $resource;
        return $resource(`${endpoint}/:id/:controller`, paramDefaults, actions);
    }
};

export function PCUserProvider(){

    let self = this;

    self.config = new UserResourceConfig();

    this.$get = function($resource){
        return new UserResource(self.config, $resource);
    };

};
