'use strict';

/**
 * Stubbing of HTTP requests for backend-less frontend testing
 */
import 'angular-mocks';
import angular from 'angular';
import {Config, Run, Inject} from '../ng-decorators'; // jshint unused: false
import ScaffiCore from '../index.js';

class OnConfigPrototype {
    //start-non-standard
    @Config()
    //end-non-standard
    static configFactory($provide){
        if(ScaffiCore.config.getEnvironment() == "prototype") {
            $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
        }

    }
}

class OnRunPrototype {
    //start-non-standard
    @Run()
    //end-non-standard
    static runFactory($httpBackend, $rootScope){
        if(ScaffiCore.config.getEnvironment() == "prototype") {
            $rootScope.ENV = "prototype";
            console.log("PROTOTYE!")
    
            $httpBackend.whenGET(/^\/api\/.*/).respond((method, url, data, headers) => {
                console.log("==========================");
                console.log("   MOCK API FALLTHROUGH   ");
                headers['Content-Type'] = 'application/json;version=1';
                console.log(url)
                throw new Error("No API Service call for " + url + " declared!");
                return [404];
        
            });
            $httpBackend.whenGET(/^\w+.*/).passThrough();
            $httpBackend.whenPOST(/^\w+.*/).passThrough();
        }

    }
}
