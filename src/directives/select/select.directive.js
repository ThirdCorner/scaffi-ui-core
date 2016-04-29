'use strict';

import _ from 'lodash';
import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'select'
})
//end-non-standard
class Select {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'E';
		this.scope = false;


	}

	link(scope, element, attrs, ngModel){
		// MD Specific; needs to be moved elsewhere
		// var foundMdSelect = false;
		// _.each(element.parent().children(), (child) =>{
		// 	if(child.tagName == 'MD-SELECT') {
		// 		foundMdSelect = true;
		// 	}
		// });
		//
		// if(!foundMdSelect || element.parent().tagName == 'MD-INPUT-CONTAINER') {
		// 	throw new Error("You must use 'md-select' for dropdowns, not 'select'.");
		// }

	}

	static directiveFactory($rootScope, $state){

		Select.instance = new Select($rootScope, $state);
		return Select.instance;
	}
}

export default Select;

