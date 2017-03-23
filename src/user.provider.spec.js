'use strict';

import {PCUserProvider} from './src/user.provider';
import {UserResource} from './src/user.provider';
import {UserResourceConfig} from './src/user.provider';
import {lodash} from 'lodash';

var resourceMock = {

};

describe("User CRUD", function(){
    var userResourceConfig,
        userResourceInstance;
        
    beforeEach(function(){
        userResourceConfig = new UserResourceConfig();
        userResourceInstance = new UserResource(userResourceConfig, resourceMock);
    });

    describe("UserResource save", function(){

    });

});
