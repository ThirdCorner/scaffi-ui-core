'use strict';
import _ from 'lodash';
import {Directive} from '../../ng-decorators'; // jshint unused: false;
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
	
	link(scope, element, attrs, ngModel){
		
		ngModel.$validators.validate = function (modelValue, viewValue) {
			if(modelValue !== viewValue) {
				var returnEval = scope.$eval(attrs.validate);
				if(!_.isBoolean(returnEval)) {
					throw new Error("You must return a boolean from " + attrs.validate);
				}
				return returnEval;
			} else {
				return true;
			}
		};
		
		scope.$watch(()=>{
			return scope.$eval(attrs.validate);
		}, ()=>{
			ngModel.$validate();
		});
		
	}
	
	static directiveFactory($rootScope, $state){
		
		Validate.instance = new Validate($rootScope, $state);
		return Validate.instance;
	}
}

export default Validate;

