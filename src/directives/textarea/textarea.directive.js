'use strict';

import _ from 'lodash';


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

