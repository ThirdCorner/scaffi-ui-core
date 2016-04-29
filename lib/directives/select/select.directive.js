'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//end-non-standard
// jshint unused: false;
//start-non-standard
var Select = (_dec = (0, _ngDecorators.Directive)({
	selector: 'select'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function Select($rootScope, $state) {
		_classCallCheck(this, Select);

		this.restrict = 'E';
		this.scope = false;
	}

	_createClass(Select, [{
		key: 'link',
		value: function link(scope, element, attrs, ngModel) {
			// MD Specific; needs to be moved elsewhere
			// var foundMdSelect = false;
			// _.each(element.parent().children(), (child) =>{
			// 	if(child.tagName == 'MD-SELECT') {
			// 		foundMdSelect = true;
			// 	}
			// });
			//
			// if(!foundMdSelect || element.parent().tagName == 'MD-INPUT-CONTAINER') {
			// 	throw new Error("You must use 'md-select' for dropdowns, not 'select'.");
			// }

		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			Select.instance = new Select($rootScope, $state);
			return Select.instance;
		}
	}]);

	return Select;
}()) || _class);
exports.default = Select;