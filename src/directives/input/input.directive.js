'use strict';

import _ from 'lodash';

import {ValidationGeneratorHelper} from '../../index.js';

import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'input'
})
//end-non-standard
class Input {

	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'E';
		this.scope = false;
		
	}
	compile(element, attrs){
		
		
		if(!attrs) {
			attrs = {};
		}
		if(attrs.class && attrs.class.indexOf("md-datepicker-input") !== -1) {
			attrs.type = 'date';
		}
		
		if(!attrs.type) {
			throw new Error("You must specify a type for this input.");
		}
		
		if(attrs.ngRequired && scope.$parent.$eval(attrs.ngRequired) === true) {
			attrs.required = true;
		}
		
		if(attrs.required) {
			attrs.required = true;
		}
		
		var validationAttributes = {
			required: 'This field cannot be left empty.',
			minlength: 'This field must be at least {minlength} characters long.',
			maxlength: 'This field cannot be more than {maxlength} characters long.',
			ngPattern: null
			
		};
		
		if(ValidationGeneratorHelper.hasRestrictions(attrs, validationAttributes)) {
			/*
			 Need to move this into system theme checking validation
			 */
			// // Check for name attr
			// if(element.parent()[0].tagName != 'MD-INPUT-CONTAINER') {
			// 	throw new Error("Your input must be nested in an md-input-container.");
			// }
			
			ValidationGeneratorHelper.generateMessageDiv(element, validationAttributes, attrs);
		}
		
		return {
			pre: (scope, element, attrs, ngModel)=>{
				
				
			}
		}
	}



	static directiveFactory($rootScope, $state){

		Input.instance = new Input($rootScope, $state);
		return Input.instance;
	}
}

export default Input;

