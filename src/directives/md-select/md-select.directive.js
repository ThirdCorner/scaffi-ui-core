'use strict';

import _ from 'lodash';

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

