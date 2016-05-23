'use strict';

import _ from 'lodash';
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

