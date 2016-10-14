'use strict';

import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'form'
})
//end-non-standard
class Form {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'E';
		this.scope = false;

	}
	compile(element, attrs) {
		if(!attrs.name) {
			throw new Error("Your form must have a 'name' attribute.");
		}
		if(attrs.name.indexOf("-") !== -1) {
			throw new Error("Your form name cannot contain -. Use Camel Case.");
		}
		
		element.attr("novalidate", true);
		
		
		return {
			pre: function(scope, element, attrs, ngModel) {
				element.bind("submit", function(e){
					e.preventDefault();
					
					if(scope[attrs.name].$valid) {
						scope.$eval(attrs.onSubmit);
						return true;
					}
					
					return false;
				});
			}
		}
	}
	// link(scope, element, attrs, ngModel){
	//
	// 	// if(!_.endsWith(attrs.name, "Form")) {
	// 	// 	throw new Error("Your form name must end in 'Form' otherwise nested scope validators won't attach properly. Something like 'editForm'")
	// 	// }
	// 	/*
	// 	`   We don't want to enforce this is we're doing live edits
	// 	 */
	// 	// if(!attrs.onSubmit) {
	// 	// 	throw new Error("You must provide an on-submit tag on your form element. This is the fn that gets called when the form is valid.");
	// 	// }
	//
	// 	element.attr("novalidate", true);
	//
	// 	element.bind("submit", function(e){
	// 		e.preventDefault();
	//
	// 		if(scope[attrs.name].$valid) {
	// 			scope.$eval(attrs.onSubmit);
	// 			return true;
	// 		}
	//
	// 		return false;
	// 	});
	//
	// }


	static directiveFactory($rootScope, $state){

		Form.instance = new Form($rootScope, $state);
		return Form.instance;
	}
}

export default Form;

