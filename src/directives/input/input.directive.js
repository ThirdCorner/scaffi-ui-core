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
				
		var messageContainer = null;
		if(attrs.name) {
			messageContainer = ValidationGeneratorHelper.generateMessageContainer(element, attrs.name, attrs);
		}
		
		var validationAttributes = {
			required: 'This field cannot be left empty.',
			minlength: 'This field must be at least {minlength} characters long.',
			maxlength: 'This field cannot be more than {maxlength} characters long.',
			ngPattern: null
			
		};
		/*
			Because of ngMessages happening in the compile, if you try to add the messages in the pre link,
			ngMessage directive WILL NOT pick them up.
		 */
		ValidationGeneratorHelper.generateMessageDiv(element, messageContainer, validationAttributes, attrs);
		
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

