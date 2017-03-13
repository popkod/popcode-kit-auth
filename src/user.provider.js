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

/**
 * User resource class
 * responsible for user CRUD
 */
export class UserResource{
    constructor({endpoint, paramDefaults, actions}, $resource){
        resourceProvider = $resource;
        this.resource = $resource(`${endpoint}/:id/:controller`, paramDefaults, actions);
    }

    /**
     * Pushes error messages to an angular form
     * @param   {object}    $form   the reference of the form
     * @return  {function}
     */
    errorHandler($form){
        return function(response){
            if($form !== undefined && typeof $form.$setPristine == 'function'){
                if(response.status == 400 && response.data.error){
                    Object.keys($form).forEach(function(key){
                        if(/$/.test()){

                        }
                        let value = response.data.error[key];
                        if($form[key] && $form[key].$error)
                            $form[key].$error.error = value;
                    });
                }
            }
        }
    }

    /**
     * Get a lit of users
     * @param   {object}(optional)  query   additional query
     * @return  {Promise}
     */
    index(query = {}){
        return this.resource.index(query);
    }

    /**
     * Get a user
     * @param   {object}    query   additional query
     * @return  {Promise}
     */
    get(query = {}){
        return this.resource.get(query);
    }

    /**
     * Deletes an item
     * @param   {object}            data    user data
     * @param   {array}(optional)   list    list of users we will get out the user object from
     * @return  {Promise}
     */
    delete(data, ...parameters){
        let instance = data && typeof data === 'object' && data.hasOwnProperty('$delete') ?
            data : new this.resource(data),
            list = Array.isArray(parameters[0]) ? parameters[0] : undefined;

        return instance.$delete({id: instance.id}, function(){
            if(typeof list !== undefined){
                let index = _lodash.findIndex(list, {id: instance.id});
                if(index > -1){ list.splice(index, 1); }
            }
        }, this.errorHandler());
    }

    /**
     * Saves an item
     * If data object has an id, it will consider the request as an update,
     * if id not provided, then it will be a create request
     * @param   {object}            data    user dtata
     * @param   {array}(optional)   list    list of users we manipulate after the request
     * @param   {object}(optional)  $form   angular form we will push error messages into
     * @return  {Promise}
     */
    save(data, ...parameters){

        let list = undefined,
            $form = undefined,
            instance = new this.resource(data);

        parameters.forEach(function(param){
            if(param !== null && typeof param === 'object'){
                $form = param;
            }
            if(param !== null && Array.isArray(param)){
                list = param;
            }
        });

        if(instance.id){
            return instance.$update({id:instance.id}, function(result){
                if(list !== undefined){
                    let index = _lodash.findIndex(list, {id: instance.id});
                    if(index > -1){ list.splice(index, 1, result); }
                }
            }, this.errorHandler($form));
        }else{
            return instance.$save(function(result){
                if(list !== undefined){
                    list.push(result);
                }
            }, this.errorHandler($form));
        }
    }
};

/**
 * User Resource Provider
 * @return Angular Provider
 */
export function PCUserProvider(){

    let self = this;

    self.config = new UserResourceConfig();

    this.$get = function($resource, lodash)
    {
        _lodash = lodash;
        return new UserResource(self.config, $resource);
    };

};
