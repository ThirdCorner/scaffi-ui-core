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

		Textarea.instance = new Textarea($rootScope, $state);
		return Textarea.instance;
	}
}

export default Textarea;

