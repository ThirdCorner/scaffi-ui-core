'use strict';

import _ from 'lodash';

import {ValidationGeneratorHelper} from '../../index.js';

import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'md-select'
})
//end-non-standard
class MdSelect {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'E';
		this.scope = false;

	}

	compile(element, attrs){
		
		if(element.parent()[0].tagName != 'MD-INPUT-CONTAINER') {
			throw new Error("Your input must be nested in an md-input-container.");
		}
		
		var messageContainer = null;
		if(attrs.name) {
			messageContainer = ValidationGeneratorHelper.generateMessageContainer(element, attrs.name, attrs);
		}
		
	
		
		return {
			pre: (scope, element, attrs, ngModel)=>{
				
				var validationAttributes = {
					required: 'This field cannot be left empty.'
				};
				
				
				ValidationGeneratorHelper.generateMessageDiv(element, messageContainer, validationAttributes, attrs);
			}
		}
	}


	static directiveFactory($rootScope, $state){

		MdSelect.instance = new MdSelect($rootScope, $state);
		return MdSelect.instance;
	}
}

export default MdSelect;

