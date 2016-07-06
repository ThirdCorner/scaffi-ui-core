'use strict';

import 'angular-mocks';
import angular from 'angular';
import {Config, Run} from '../ng-decorators'; // jshint unused: false
import ScaffiCore from '../index.js';

class OnConfigTest {
	//start-non-standard
	@Config()
	//end-non-standard
	static configFactory($provide){
		if(ScaffiCore.config.isQaMode()) {
			console.log("config test")
		}

	}
}

class OnRunTest {
	//start-non-standard
	@Run()
	//end-non-standard
	static runFactory($rootScope){

	}
}
