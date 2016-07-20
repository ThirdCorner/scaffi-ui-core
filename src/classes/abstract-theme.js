'use strict';

import _ from 'lodash';

class AbstractTheme {
	/*
		Extendables
	 */
	initialize(){}
	
	
	/*
		Class Logic
	 */
	constructor(args) {
		this.params = args || {};
		if(!this.params || !_.isObject(this.params)) {
			throw new Error("You must pass an object as the first param for initializing a theme");
		}

		if(!_.has(this.params, "appModule")) {
			throw new Error("You must pass the module returned from ScaffiUi.initialize");
		}
		
		this.initialize();
	}
	getApp(){
		return this.params.appModule;
	}
	addRequires(requiresArr){
		var mainModule = this.getApp();
		mainModule.requires = mainModule.requires.concat(requiresArr);
	}

}

export default AbstractTheme;