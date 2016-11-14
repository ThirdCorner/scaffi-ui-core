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
var Validator = (_dec = (0, _ngDecorators.Directive)({
	selector: 'validator'
}), _dec(_class = function () {
	/*
  If you add constructor injectors, you need to add them to the directiveFactory portion as well
  Otherwise, you'll get an injection error
  */

	function Validator($rootScope, $state) {
		(0, _classCallCheck3.default)(this, Validator);

		this.require = 'ngModel';
		this.restrict = 'A';
		this.scope = false;
	}

	(0, _createClass3.default)(Validator, [{
		key: 'link',
		value: function link(scope, element, attrs, ctrl) {

			ctrl.$validators.validator = function (modelValue, viewValue) {

				if (!viewValue) {
					return true;
				}
				var returnEval = scope.$eval(attrs.validator);
				console.log(scope, attrs.validator, scope.$eval(attrs.validator), returnEval);
				console.log("MODEL: ", modelValue, " view: ", viewValue);
				return returnEval === true;
			};

			// ngModel.$validators.validator = function (modelValue, viewValue) {
			// 	if(modelValue !== viewValue) {
			// 		var returnEval = scope.$eval(attrs.validator);
			// 		if(!_.isBoolean(returnEval)) {
			// 			throw new Error("You must return a boolean from " + attrs.validator);
			// 		}
			// 		return returnEval;
			// 	} else {
			// 		return true;
			// 	}
			// };
			//
			// scope.$watch(()=>{
			// 	return scope.$eval(attrs.validator);
			// }, ()=>{
			// 	ngModel.$validator();
			// });
			//
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			Validator.instance = new Validator($rootScope, $state);
			return Validator.instance;
		}
	}]);
	return Validator;
}()) || _class);
exports.default = Validator;