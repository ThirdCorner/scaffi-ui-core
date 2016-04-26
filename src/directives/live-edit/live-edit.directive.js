'use strict';

import _ from 'lodash';
import {EnvironmentHelper} from '../../index.js';
import {DataModel} from '../../index.js';
import ScaffiCore from '../../index.js';
var ID_PROP;

import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'live-edit'
})
//end-non-standard
class LiveEdit {
	/*
		If you add constructor injectors, you need to add them to the directiveFactory portion as well
		Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state, $timeout){
		ID_PROP = ScaffiCore.config.getIdPropertyName();
		this.restrict = 'A';
		this.require = 'ngModel';
		this.scope = {
		};

		this.$timeout = $timeout;

	}

	compile(element, attrs) {



		if(EnvironmentHelper.isLiveEditEnabled()) {


			element.after(`<live-edit-view ng-model="${attrs['ngModel']}"></live-edit-view>`);

			var that = this;
			return {
				pre: (scope, element, attrs, ngModel) => {

					scope.editMode = ()=>{
						element.removeClass('ng-hide');
						element[0].focus();
						var setElem = angular.element(element.parent().find('live-edit-view'));
						setElem.triggerHandler("hide");
					};

					scope.displayMode = ()=>{
						element.addClass('ng-hide');
						var setElem = angular.element(element.parent().find('live-edit-view'));
						setElem.triggerHandler("show");
					};

					element.on("click", ()=>{
						scope.editMode();
					});
					var loading = true;
					if (ngModel) {

						/*
							This needs to be able to account for nested objs
						 */
						var modelBits = attrs["ngModel"].split(".");
						var propName = modelBits.pop();
						var parentName = modelBits.pop();

						var inputScope = scope.$parent;

						var isEditable = ()=>{
							return inputScope[parentName][ID_PROP];
						};

						var syncValue = function(){
							var hasChanged = scope.originalValue != ngModel.$modelValue;

							if(isEditable()) {
								scope.displayMode(ngModel.$modelValue);
							}

							if(loading) return true;

							if (element.hasClass("ng-valid") && isEditable() && hasChanged) {
								scope.originalValue = ngModel.$modelValue;
								inputScope[parentName].pushChanges(propName);
								scope.displayMode();

								return true;
							}

							return false;
						};

						if(!_.has(inputScope, parentName)) {
							throw new Error(`Can't find ${parentName} in element scope.`);
						}

						/*
							only enable if they pass in a restmodel
						 */
						if(!(inputScope[parentName] instanceof DataModel)) {
							throw new Error("You're trying to use live edit mode but the model attached is not an instance of a DataModel. Is it created?");
							return false;
						}



						if(element[0].tagName == "INPUT") {
							element.on("blur", ()=> {

								return syncValue();

							});


						} else {
							scope.$watch(()=> {
								return ngModel.$modelValue;
							}, function (newValue, oldValue) {
								syncValue();
							});
						}




						/*
							For when model is loaded
						 */


						that.$timeout(()=>{
							loading = false;

							if(ngModel.$modelValue == null || _.isUndefined(ngModel.$modelValue) || (_.isString(ngModel.$modelValue) && ngModel.$modelValue.length == 0)) {
								scope.editMode();
							} else {
								scope.displayMode(ngModel.$modelValue);
							}

							scope.originalValue = ngModel.$modelValue;
						});

					}
				},
				post: (scope, element, attrs, ngModel) =>{

				}
			}
		}
	}


	
	static directiveFactory($rootScope, $state, $timeout){

		LiveEdit.instance = new LiveEdit($rootScope, $state, $timeout);
		return LiveEdit.instance;
	}
}

export default LiveEdit;

