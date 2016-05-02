'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _ngDecorators = require('../../ng-decorators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		_classCallCheck(this, Form);

		this.restrict = 'E';
		this.scope = false;
	}

	_createClass(Form, [{
		key: 'compile',
		value: function compile(element, attrs) {
			if (!attrs.name) {
				throw new Error("Your form must have a 'name' attribute.");
			}
			if (attrs.name.indexOf("-") !== -1) {
				throw new Error("Your form name cannot contain -. Use Camel Case.");
			}

			if (attrs.name != "form") {
				angular.element(element).attr("name", "_form");

				/*
    	The reason we're doing this is because, if you have form elements in an isolated scope,
    	there's no way to access the form name in the compile function because it's not generated yet.
    	And you can't generate the ngMessages in the pre function of an input because the directive attr
    	doesn't attach to ng-messages properly.
     */
				console.log("I had to change your form name to 'form' in order for the ng-message validators to work.");
			}

			element.attr("novalidate", true);

			element.bind("submit", function (e) {
				e.preventDefault();

				if (scope[attrs.name].$valid) {
					scope.$eval(attrs.onSubmit);
					return true;
				}

				return false;
			});
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