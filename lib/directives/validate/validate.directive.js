'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class;

var _scaffiUiCore = require('scaffi-ui-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//end-non-standard
// jshint unused: false;
//start-non-standard
var Validate = (_dec = (0, _scaffiUiCore.Directive)({
	selector: 'validate'
}), _dec(_class = function () {
	/*
  If you add constructor injectors, you need to add them to the directiveFactory portion as well
  Otherwise, you'll get an injection error
  */

	function Validate($rootScope, $state) {
		(0, _classCallCheck3.default)(this, Validate);

		this.require = 'ngModel';
		this.restrict = 'A';
		this.scope = false;
	}

	(0, _createClass3.default)(Validate, [{
		key: 'link',
		value: function link(scope, element, attrs, ctrl) {

			scope.$watch(attrs.validate, function (newVal) {
				ctrl.$setValidity("validate", newVal === true);
			});

			/*
    Validators do NOT work with fn evals for some reason. Do not switch to these in angular 1.5
    */
			// ctrl.$validators.validator = function(modelValue, viewValue){
			// 	var returnEval = scope.$eval(attrs.validator);
			// 	console.log(scope, attrs.validator, scope.$eval(attrs.validator), returnEval);
			// 	console.log("MODEL: ", modelValue, " view: ",  viewValue)
			// 	return returnEval === true ? true : false;
			// };
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			Validate.instance = new Validate($rootScope, $state);
			return Validate.instance;
		}
	}]);
	return Validate;
}()) || _class);
exports.default = Validate;