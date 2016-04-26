'use strict';

import {Run, Config, Inject} from '../ng-decorators'; // jshint unused: false
import ScaffiCore from '../index.js';

class OnConfigProd{
    //start-non-standard
    @Config()
    @Inject('$compileProvider', '$httpProvider')
    //end-non-standard
    static configFactory($compileProvider, $httpProvider){
        if(ScaffiCore.config.getEnvironment() == "prod") {
            // disabling debug data to get better performance gain in production
            $compileProvider.debugInfoEnabled(false);
            // configure $http service to combine processing of multiple http responses received at
            // around the same time via $rootScope.$applyAsync to get better performance gain in production
            $httpProvider.useApplyAsync(true);
        }
    }
}
class OnRunProd {
    //start-non-standard
    @Run()
    @Inject('$rootScope')
    //end-non-standard
    static runFactory($rootScope){
        if(ScaffiCore.config.getEnvironment() == "prod") {
            $rootScope.ENV = "prod";
        }
    }
}

export {OnConfigProd, OnRunProd};
