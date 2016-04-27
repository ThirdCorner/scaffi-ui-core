'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../../index.js');

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//end-non-standard
// jshint unused: false;
//start-non-standard
var Textarea = (_dec = (0, _ngDecorators.Directive)({
	selector: 'textarea'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function Textarea($rootScope, $state) {
		_classCallCheck(this, Textarea);

		this.restrict = 'E';
		this.scope = {};
	}

	_createClass(Textarea, [{
		key: 'compile',
		value: function compile(element, attrs) {

			var validationAttributes = {
				required: 'This field cannot be left empty.',
				minlength: 'This field must be at least {minlength} characters long.',
				maxlength: 'This field cannot be more than {maxlength} characters long.',
				ngPattern: null

			};

			if (_index.ValidationGeneratorHelper.hasRestrictions(attrs, validationAttributes)) {
				// Check for name attr
				if (element.parent()[0].tagName != 'MD-INPUT-CONTAINER') {
					throw new Error("Your input must be nested in an md-input-container.");
				}

				_index.ValidationGeneratorHelper.generateMessageDiv(element, validationAttributes, attrs);
			}

			return {
				pre: function pre(scope, element, attrs, ngModel) {}
			};
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			Textarea.instance = new Textarea($rootScope, $state);
			return Textarea.instance;
		}
	}]);

	return Textarea;
}()) || _class);
exports.default = Textarea;