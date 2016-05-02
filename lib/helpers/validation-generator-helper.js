"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ValidationGeneratorHelper = {
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
	generateMessageContainer: function generateMessageContainer(elem, name, attrs) {
		/*
  	We can't eval this because there is no scope during compile, so we have to pass through and deal with it on the directive side.
  	Mainly, this for md-autocomplete
   */
		if (_lodash2.default.startsWith(attrs.name, "{{")) {
			return null;
		}
		var messageName = "_form." + name + ".$error";
		var div = angular.element('<div ng-messages="' + messageName + '" multiple md-auto-hide="false" role="alert"></div>');
		elem.after(div);

		return div;
	},


	/*
  Because of ngMessages happening in the compile, if you try to add the messages in the pre link,
  ngMessage directive WILL NOT pick them up.
  */
	generateMessageDiv: function generateMessageDiv(element, messageContainer, allowedRestrictions, attrs) {

		var scope = angular.element(element).scope();
		if (attrs.ngRequired && scope && scope.$parent.$eval(attrs.ngRequired) === true) {
			attrs.required = true;
		}

		if (attrs.required) {
			attrs.required = true;
		}

		if (ValidationGeneratorHelper.hasRestrictions(attrs, allowedRestrictions) && messageContainer) {

			var messages = this.getValidationMessage(allowedRestrictions, attrs);
			var html = "";
			var containerValue = messageContainer.attr("ng-messages");
			_lodash2.default.each(messages, function (msg, prop) {
				var show = containerValue + "." + prop;
				html += '<div ng-message="' + prop + '">' + msg + '</div>';
			});

			messageContainer.html(html);
		}

		return true;
	}
};

exports.default = ValidationGeneratorHelper;