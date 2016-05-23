'use strict';

import {Directive} from '../../ng-decorators'; // jshint unused: false;
import _ from 'lodash';

const COMPILE = new WeakMap();


//start-non-standard
@Directive({
	selector: 'name'
})
//end-non-standard
class Name {
	/*
	 If you add constructor injectors, you need to add them to the directiveFactory portion as well
	 Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state, $compile){
		this.restrict = 'A';
		this.scope = false;
		
		COMPILE.set(this, $compile);
		
		
	}
	
	compile(){
		
		return {
			post: (scope, element, attrs, formCtrl) => {
				
				if (attrs.ngModel && !_.startsWith(attrs.name, ".")) {
					
					var ngAttrs = {
						ngRequired: "required",
						ngPattern: "pattern",
						mdMinlength: "minlength",
						mdMaxlength: "maxlength"
					};
					var messageTypes = {
						required: 'Required',
						min: 'Value too small',
						max: 'Value too big',
						minlength: 'Too short',
						maxlength: 'Too long',
						pattern: null,
						validate: null
					};
					
					var messagesToGenerate = {};
					
					var formElemName = "formCtrl." + attrs.name;
					var messages = `<div class="validation-messages">`;
					
					_.forEach(messageTypes, (value, name)=> {
						
						if(!_.has(attrs, name)){
							return true;
						}
						
						if (_.has(attrs, name + "Message")) {
							value = attrs[name + "Message"];
							
						}
						
						if(!value) {
							throw new Error(`You must provide a ${_.kebabCase(name)}-message attribute if you want to validate on it`);
							return false;
						}
						
						messagesToGenerate[name] = value;
					}, this);
					
					_.forEach(attrs, (value, name)=>{
						if( (_.startsWith(name, "ng") && _.has(ngAttrs, name))){
							var preChopName = name;
							name = _.camelCase(name.substr(2));
							
							var messageValue;
							if(_.has(messageTypes, name)){
								messageValue = messageTypes[name];
							}
							
							if(_.has(attrs, preChopName + "Message")) {
								messageValue = attrs[preChopName + "Message"];
							}
							
							if(!messageValue) {
								throw new Error(`You must provide a ${_.kebabCase(preChopName)}-message attribute if you want to validate on it`);
								return false;
							}
							
							messagesToGenerate[name] = messageValue;
						}
					});
					
					_.forEach(messagesToGenerate, (value, name)=>{
						
						messages += `<div class="message" role="alert" ng-show="${formElemName}.$error.${name} && (formCtrl.$submitted || (${formElemName}.$touched && ${formElemName}.$invalid))">${value}</div>`
					});
					
					messages += "</div>";
					
					
					var div = COMPILE.get(this)(messages)(scope);
					element.after(div);
					
					
				}
				
			}
		}
	}
	
	
	
	static directiveFactory($rootScope, $state, $compile){
		
		Name.instance = new Name($rootScope, $state, $compile);
		return Name.instance;
	}
}

export default Name;
