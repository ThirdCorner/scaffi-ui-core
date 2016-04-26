'use strict';

import _ from 'lodash';
import {Directive} from '../../ng-decorators'; // jshint unused: false;
import ScaffiCore from '../../index.js';
import {DataModel} from '../../index.js';
var ID_PROP;
//start-non-standard
@Directive({
	selector: 'live-edit-blur-submit'
})
//end-non-standard
class LiveEditBlurSubmit {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state, $timeout){
		ID_PROP = ScaffiCore.config.getIdPropertyName();
		this.restrict = 'A';
		this.require = 'ngModel';
		this.scope = false;


	}

	link(scope, element, attrs, ngModel){
		var modelBits = attrs["ngModel"].split(".");
		var propName = modelBits.pop();
		var parentName = modelBits.pop();
		if(!_.has(scope, parentName)) {
			throw new Error(`Can't find ${parentName} in element scope.`);
		}

		/*
		 only enable if they pass in a restmodel
		 */
		if(!(scope[parentName] instanceof DataModel)) {
			throw new Error("You're trying to use live edit mode but the model attached is not an instance of a DataModel. Is it created?");
			return false;
		}

		var loading = true;
		if(!scope[parentName][ID_PROP]) {
			// element.focus();

			scope.displayMode = ()=>{

				element.addClass('ng-hide');
				var setElem = angular.element(element.parent().find('live-edit-view'));
				setElem.triggerHandler("show");
			};

			if(element[0].tagName == "INPUT") {

				element.on("blur", ()=> {
					if(loading) return true;

					if (element.hasClass("ng-valid") && !scope[parentName][ID_PROP]) {
						scope[parentName].save();
						scope.displayMode();
					}
				});
			} else {
				scope.$watch(()=> {
					return ngModel.$valid;
				}, function (newValue, oldValue) {
					if(loading) return true;

					if(newValue) {
						if (!scope[parentName][ID_PROP]) {
							scope[parentName].save();
							scope.displayMode();
						}
					}
				});
			}
		}

		setTimeout(()=>{
			loading = false;
		})

	}

	static directiveFactory($rootScope, $state, $timeout){

		LiveEditBlurSubmit.instance = new LiveEditBlurSubmit($rootScope, $state, $timeout);
		return LiveEditBlurSubmit.instance;
	}
}

export default LiveEditBlurSubmit;

