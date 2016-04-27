'use strict';

/**
 * Stubbing of HTTP requests for backend-less frontend testing
 */
import 'angular-mocks';
import angular from 'angular';
import 'app/services/mock-services';
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
    static runFactory($rootScope){
        if(ScaffiCore.config.getEnvironment() == "prototype") {
            $rootScope.ENV = "prototype";
        }

    }
}
