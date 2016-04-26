'use strict';

import 'angular-mocks';
import angular from 'angular';
import {Config, Run, Inject} from '../ng-decorators'; // jshint unused: false
import ScaffiCore from '../index.js';

class OnConfigDev {
    //start-non-standard
    @Config()
    //end-non-standard
    static configFactory($provide){
        if(ScaffiCore.config.getEnvironment() == "dev") {
            console.log("config dev")
        }

    }
}

class OnRunDev {
    //start-non-standard
    @Run()
    //end-non-standard
    static runFactory($rootScope){
        if(ScaffiCore.config.getEnvironment() == "dev") {
            $rootScope.ENV = "dev";
        }
    }
}
