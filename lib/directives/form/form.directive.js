'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class;

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//end-non-standard
// jshint unused: false;
//start-non-standard
var Form = (_dec = (0, _ngDecorators.Directive)({
	selector: 'form'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function Form($rootScope, $state) {
		(0, _classCallCheck3.default)(this, Form);

		this.restrict = 'E';
		this.scope = false;
	}

	(0, _createClass3.default)(Form, [{
		key: 'compile',
		value: function compile(element, attrs) {
			if (!attrs.name) {
				throw new Error("Your form must have a 'name' attribute.");
			}
			if (attrs.name.indexOf("-") !== -1) {
				throw new Error("Your form name cannot contain -. Use Camel Case.");
			}

			element.attr("novalidate", true);

			return {
				pre: function pre(scope, element, attrs, ngModel) {
					element.bind("submit", function (e) {
						e.preventDefault();

						if (scope[attrs.name].$valid) {
							scope.$eval(attrs.onSubmit);
							return true;
						}

						return false;
					});
				}
			};
		}
		// link(scope, element, attrs, ngModel){
		//
		// 	// if(!_.endsWith(attrs.name, "Form")) {
		// 	// 	throw new Error("Your form name must end in 'Form' otherwise nested scope validators won't attach properly. Something like 'editForm'")
		// 	// }
		// 	/*
		// 	`   We don't want to enforce this is we're doing live edits
		// 	 */
		// 	// if(!attrs.onSubmit) {
		// 	// 	throw new Error("You must provide an on-submit tag on your form element. This is the fn that gets called when the form is valid.");
		// 	// }
		//
		// 	element.attr("novalidate", true);
		//
		// 	element.bind("submit", function(e){
		// 		e.preventDefault();
		//
		// 		if(scope[attrs.name].$valid) {
		// 			scope.$eval(attrs.onSubmit);
		// 			return true;
		// 		}
		//
		// 		return false;
		// 	});
		//
		// }

	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			Form.instance = new Form($rootScope, $state);
			return Form.instance;
		}
	}]);
	return Form;
}()) || _class);
exports.default = Form;