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
var Validate = (_dec = (0, _ngDecorators.Directive)({
	selector: 'validate'
}), _dec(_class = function () {
	/*
  If you add constructor injectors, you need to add them to the directiveFactory portion as well
  Otherwise, you'll get an injection error
  */

	function Validate($rootScope, $state) {
		_classCallCheck(this, Validate);

		this.require = 'ngModel';
		this.restrict = 'A';
		this.scope = false;
	}

	_createClass(Validate, [{
		key: 'link',
		value: function link(scope, element, attrs, ngModel) {

			ngModel.$validators.validate = function (modelValue, viewValue) {

				return scope.$eval(attrs.validate);
			};

			scope.$watch(function () {
				return scope.$eval(attrs.validate);
			}, function () {
				ngModel.$validate();
			});
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