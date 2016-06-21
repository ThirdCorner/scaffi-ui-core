'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//end-non-standard
// jshint unused: false;
//start-non-standard
var Input = (_dec = (0, _ngDecorators.Directive)({
	selector: 'input'
}), _dec(_class = function () {

	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function Input($rootScope, $state) {
		(0, _classCallCheck3.default)(this, Input);

		this.restrict = 'E';
		this.scope = false;
	}

	(0, _createClass3.default)(Input, [{
		key: 'compile',
		value: function compile(element, attrs) {

			if (!attrs) {
				attrs = {};
			}
			if (attrs.class && attrs.class.indexOf("md-datepicker-input") !== -1) {
				attrs.type = 'date';
			}

			return {
				pre: function pre(scope, element, attrs, ngModel) {}
			};
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			Input.instance = new Input($rootScope, $state);
			return Input.instance;
		}
	}]);
	return Input;
}()) || _class);
exports.default = Input;