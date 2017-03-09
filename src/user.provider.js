'use strict';

let resourceProvider;
let _lodash;

export class UserResourceConfig{
    constructor(){
        this.endpoint = '/api/users';
        this.paramDefaults = {
            'id' : '@id'
        };
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
        resourceProvider = $resource;
        this.resource = $resource(`${endpoint}/:id/:controller`, paramDefaults, actions);
    }

    errorHandler(response){
        console.error(response);
    }

    index(){
        return this.resource.index();
    }

    get(query){
        return this.resource.get(query);
    }

    delete(userInstance, userList){
        return userInstance.$delete({id: userInstance.id}, function(){
            if(userList){
                let index = _lodash.findIndex(userList, {id: userInstance.id});
                if(index > -1){ userList.splice(index, 1); }
            }
        }, this.errorHandler);
    }

    save(data, userList){
        let instance = new this.resource(data);
        if(instance.id){
            return instance.$update({id:data.id}, function(result){
                if(userList){
                    let index = _lodash.findIndex(userList, {id: instance.id});
                    if(index > -1){ userList.splice(index, 1, result); }
                }
            }, this.errorHandler);
        }else{
            console.log(3);
            return instance.$save(function(result){
                if(userList){
                    userList.push(result);
                }
            }, this.errorHandler);
        }
    }
};

export function PCUserProvider(){

    let self = this;

    self.config = new UserResourceConfig();

    this.$get = function($resource, lodash)
    {
        _lodash = lodash;
        return new UserResource(self.config, $resource);
    };

};
