'use strict';

import {Directive} from 'scaffi-ui-core'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'validate'
})
//end-non-standard
class Validate {
	/*
	 If you add constructor injectors, you need to add them to the directiveFactory portion as well
	 Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.require = 'ngModel';
		this.restrict = 'A';
		this.scope = false;
		
	}
	
	link(scope, element, attrs, ctrl){
		
		scope.$watch(attrs.validate, function (newVal) {
			ctrl.$setValidity("validate", newVal === true);
		});
		
		/*
		 Validators do NOT work with fn evals for some reason. Do not switch to these in angular 1.5
		 */
		// ctrl.$validators.validator = function(modelValue, viewValue){
		// 	var returnEval = scope.$eval(attrs.validator);
		// 	console.log(scope, attrs.validator, scope.$eval(attrs.validator), returnEval);
		// 	console.log("MODEL: ", modelValue, " view: ",  viewValue)
		// 	return returnEval === true ? true : false;
		// };
		
	}
	
	static directiveFactory($rootScope, $state){
		
		Validate.instance = new Validate($rootScope, $state);
		return Validate.instance;
	}
}

export default Validate;

