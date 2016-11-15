"use strict";
import _ from 'lodash';
import ParserHelper from '../helpers/parser-helper';

var ValidationGeneratorHelper = {
	hasRestrictions(attrs, messages) {
		var hasValidation = false;
		_.each(messages, (msg, key)=>{
			if(_.has(attrs, key)) {
				hasValidation = true;
			}
		});

		return hasValidation;

	},
	getValidationMessage(allowedRestrictions, attrs){
		var setRestrictions = {};
		_.each(allowedRestrictions, (msg, type) =>{

			if(_.has(attrs, type)) {
				// Apparently angular validates on pattern, not ng-pattern;

				var messageAttr = type + "Message";

				if(_.has(attrs, messageAttr)) {
					msg = attrs[messageAttr];
				}

				var replace = `{${type}}`;
				msg = msg.replace(replace, attrs[type]);

				if(type.indexOf("ng") === 0) {
					type = type.substr(2);
					type = type[0].toLowerCase() + type.substr(1);
				}

				setRestrictions[type] = msg;
			}

		});

		return setRestrictions;
	},
	generateMessageContainer(elem, name, attrs){
		/*
			We can't eval this because there is no scope during compile, so we have to pass through and deal with it on the directive side.
			Mainly, this for md-autocomplete
		 */
		if(_.startsWith(attrs.name, "{{")){
			return null;
		}
		var messageName = "_form." + name + ".$error";
		var div = angular.element(`<div ng-messages="${messageName}" multiple md-auto-hide="false" role="alert"></div>`);
		elem.after(div);
		
		return div;
	},
	
	/*
	 Because of ngMessages happening in the compile, if you try to add the messages in the pre link,
	 ngMessage directive WILL NOT pick them up.
	 */
	generateMessageDiv(element, messageContainer, allowedRestrictions, attrs){

		var scope = angular.element(element).scope();
		if(attrs.ngRequired && scope && scope.$parent.$eval(attrs.ngRequired) === true) {
			attrs.required = true;   
		}

		if(attrs.required) {
			attrs.required = true;
		}
		
		if(ValidationGeneratorHelper.hasRestrictions(attrs, allowedRestrictions) && messageContainer) {
			
			var messages = this.getValidationMessage(allowedRestrictions, attrs);
			var html = "";
			var containerValue = messageContainer.attr("ng-messages");
			_.each(messages, (msg, prop) => {
				var elemName = containerValue.replace(".$error", "");

				var ngif = elemName + ".$touched||_form.$submitted";
				
				html += `<div ng-message="${prop}"><span ng-if="${ngif}">${msg}</span></div>`;
			});
			
			messageContainer.html(html);
		}

		return true;

	}
};

export default ValidationGeneratorHelper;