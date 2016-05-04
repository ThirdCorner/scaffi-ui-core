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
		
		
		var messageContainer = null;
		if(attrs.name) {
			messageContainer = ValidationGeneratorHelper.generateMessageContainer(element, attrs.name, attrs);
		}
		
		
		var validationAttributes = {
			required: 'This field cannot be left empty.'
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

		MdSelect.instance = new MdSelect($rootScope, $state);
		return MdSelect.instance;
	}
}

export default MdSelect;

