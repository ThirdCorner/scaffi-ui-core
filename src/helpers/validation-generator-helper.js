"use strict";
import _ from 'lodash';
import ParserHelper from '../helpers/parser-helper';

export default {
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
				} else if(msg == null) {
					// ng-pattern we can't define, so the user has to if they use it
					throw new Error("You must provide an validation error message for: " + type);
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
	generateMessageDiv(scope, elem, allowedRestrictions, attrs){
		var form = ParserHelper.getFormController(scope);
		if(!form) {
			console.log(scope);
			throw new Error("Trying to generate validator messages, but can't find form for element");
		}
		var formName = form.$name;
		var messages = this.getValidationMessage(allowedRestrictions, attrs);
		var elemName = attrs["name"];
		var returnMsg = `<div ng-messages="${formName}.${elemName}.$error" multiple md-auto-hide="false" role="alert">`;
		_.each(messages, (msg, prop) =>{
			returnMsg += `<div ng-message="${prop}">${msg}</div>`;
		});
		returnMsg += "</div>";

		elem.after(returnMsg);

		return true;

	}
};