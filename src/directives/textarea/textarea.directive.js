'use strict';

import _ from 'lodash';

import {ValidationGeneratorHelper} from '../../index.js';

import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'textarea'
})
//end-non-standard
class Textarea {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'E';
		this.scope = false;


	}

	compile(element, attrs){
		
		var validationAttributes = {
			required: 'This field cannot be left empty.',
			minlength: 'This field must be at least {minlength} characters long.',
			maxlength: 'This field cannot be more than {maxlength} characters long.',
			ngPattern: null
			
		};
		
		if(ValidationGeneratorHelper.hasRestrictions(attrs, validationAttributes)) {
			// MD sppecific. Need to move elsewhere
			// Check for name attr
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

		Textarea.instance = new Textarea($rootScope, $state);
		return Textarea.instance;
	}
}

export default Textarea;

