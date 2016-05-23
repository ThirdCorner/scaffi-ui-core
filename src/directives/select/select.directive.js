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
		

	}

	static directiveFactory($rootScope, $state){

		Select.instance = new Select($rootScope, $state);
		return Select.instance;
	}
}

export default Select;

