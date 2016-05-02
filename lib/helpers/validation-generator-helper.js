"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	hasRestrictions: function hasRestrictions(attrs, messages) {
		var hasValidation = false;
		_lodash2.default.each(messages, function (msg, key) {
			if (_lodash2.default.has(attrs, key)) {
				hasValidation = true;
			}
		});

		return hasValidation;
	},
	getValidationMessage: function getValidationMessage(allowedRestrictions, attrs) {
		var setRestrictions = {};
		_lodash2.default.each(allowedRestrictions, function (msg, type) {

			if (_lodash2.default.has(attrs, type)) {
				// Apparently angular validates on pattern, not ng-pattern;

				var messageAttr = type + "Message";

				if (_lodash2.default.has(attrs, messageAttr)) {
					msg = attrs[messageAttr];
				} else if (msg == null) {
					// ng-pattern we can't define, so the user has to if they use it
					throw new Error("You must provide an validation error message for: " + type);
				}
				var replace = '{' + type + '}';
				msg = msg.replace(replace, attrs[type]);

				if (type.indexOf("ng") === 0) {
					type = type.substr(2);
					type = type[0].toLowerCase() + type.substr(1);
				}

				setRestrictions[type] = msg;
			}
		});

		return setRestrictions;
	},
	generateMessageDiv: function generateMessageDiv(elem, allowedRestrictions, attrs) {

		var formName = 'form';
		var messages = this.getValidationMessage(allowedRestrictions, attrs);
		var elemName = attrs["name"];
		var returnMsg = '<div ng-messages="' + formName + '.' + elemName + '.$error" multiple md-auto-hide="false" role="alert">';
		_lodash2.default.each(messages, function (msg, prop) {
			returnMsg += '<div ng-message="' + prop + '">' + msg + '</div>';
		});
		returnMsg += "</div>";

		elem.after(returnMsg);

		return true;
	}
};