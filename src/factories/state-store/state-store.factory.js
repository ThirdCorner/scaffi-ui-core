'use strict';

import {Factory} from '../../ng-decorators'; // jshint unused: false
import _ from 'lodash';
import StateModel from '../../classes/state-model';

//start-non-standard
@Factory({
	factoryName: 'stateStore'
})
//end-non-standard
class StateStore  {
	constructor($rootScope, socketIO) {

		this.$rootScope = $rootScope;
		this.socketIO = socketIO;


		this.requestStore = [];
		this.queue = [];

		this.transitionState = null;
		this.currentState = null;

		var that = this;
		$rootScope.$on('$stateChangeStart', (event, toState) =>{
			that.transitionState = toState.name;
			that.currentState = null;
		});
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			that.currentState = toState.name;
			//that._processQueue();
			console.log(that.requestStore);
		});


	}
	registerRequest(service, url, data){
		

		var request = {url, service};

		var returnData;
		returnData = new StateModel(url, service, data, this.socketIO);
		request.data = returnData;
		this.addToStore(request);

		return returnData.getRest();

	}
	

	addToStore(request){
		this.requestStore.push(request);
	}


	static factory($rootScope, socketIO) {
		StateStore.instance = new StateStore($rootScope, socketIO);
		return StateStore.instance;
	}


}

export default StateStore;
