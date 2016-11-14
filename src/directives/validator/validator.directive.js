'use strict';
import _ from 'lodash';
import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'validator'
})
//end-non-standard
class Validator {
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

		ctrl.$validators.validator = function(modelValue, viewValue){

			if(!viewValue) {
				return true;
			}
			var returnEval = scope.$eval(attrs.validator);
			console.log(scope, attrs.validator, scope.$eval(attrs.validator), returnEval);
			console.log("MODEL: ", modelValue, " view: ",  viewValue)
			return returnEval === true;
		};
		
		// ngModel.$validators.validator = function (modelValue, viewValue) {
		// 	if(modelValue !== viewValue) {
		// 		var returnEval = scope.$eval(attrs.validator);
		// 		if(!_.isBoolean(returnEval)) {
		// 			throw new Error("You must return a boolean from " + attrs.validator);
		// 		}
		// 		return returnEval;
		// 	} else {
		// 		return true;
		// 	}
		// };
		//
		// scope.$watch(()=>{
		// 	return scope.$eval(attrs.validator);
		// }, ()=>{
		// 	ngModel.$validator();
		// });
		//
	}
	
	static directiveFactory($rootScope, $state){
		
		Validator.instance = new Validator($rootScope, $state);
		return Validator.instance;
	}
}

export default Validator;

