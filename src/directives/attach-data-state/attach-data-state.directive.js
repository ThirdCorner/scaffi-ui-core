'use strict';

import _ from 'lodash';
import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'attach-data-state'
})
//end-non-standard
class AttachDataState {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'A';
		this.require = 'ngModel';
		this.scope = false;


	}

	link(scope, element, attrs, ngModel){

		var setClasses = [];
		var modelBits = attrs["ngModel"].split(".");
		if(modelBits[0] == "vm") {
			modelBits.shift();
		}
		if(!modelBits.length) {
			return;
		}
		if(!_.has(scope.$parent, modelBits[0])) {
			console.log(scope.$parent, modelBits[0]);
			throw new Error("Can't find ngModel base node in scope");
		}

		scope.$parent[modelBits[0]].onStateChange( function(newState){
			var states = newState.split(":");
			var parent = states[0];
			var remove = [];
			_.each(setClasses, (name)=>{
				if(_.startsWith(name, parent)) {
					remove.push(name);
				}
			});
			if(remove.length) {
				_.each(remove, (name)=>{
					element.removeClass(name.replace(":", "-"));
					setClasses.splice(setClasses.indexOf(name), 1);
				}, this);
			}
			setClasses.push(newState);
			element.addClass(newState.replace(":", "-"));
		});
		

	}

	static directiveFactory($rootScope, $state){

		AttachDataState.instance = new AttachDataState($rootScope, $state);
		return AttachDataState.instance;
	}
}

export default AttachDataState;

