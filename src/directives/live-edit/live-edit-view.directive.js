'use strict';

import _ from 'lodash';

import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
	selector: 'live-edit-view'
})
//end-non-standard
class LiveEditView {
	/*
	 If you add constructor injectors, you need to add them to the directiveFactory portion as well
	 Otherwise, you'll get an injection error
	 */
	constructor($rootScope, $state){
		this.restrict = 'E';
		this.require = 'ngModel';
		this.scope = false;



	}
	link(scope, element, attrs, ngModel){

		element.on("click", ()=>{
			_.each(element.parent().children(), (item)=>{
				if(!_.isUndefined(angular.element(item).attr('live-edit'))){
					item.click();
				}
			});
		});
		element.on("hide", ()=>{
			element.addClass("ng-hide");
		});
		element.on("show", ()=>{
			element.removeClass("ng-hide");
		});
		scope.$watch( ()=>{
			return ngModel.$modelValue;
		}, (newValue) =>{
			element.text(newValue);
		}, true);

	}

	static directiveFactory($rootScope, $state){

		LiveEditView.instance = new LiveEditView($rootScope, $state);
		return LiveEditView.instance;
	}
}

export default LiveEditView;

