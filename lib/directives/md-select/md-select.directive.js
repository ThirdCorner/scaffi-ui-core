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
var MdSelect = (_dec = (0, _ngDecorators.Directive)({
	selector: 'md-select'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function MdSelect($rootScope, $state) {
		(0, _classCallCheck3.default)(this, MdSelect);

		this.restrict = 'E';
		this.scope = false;
	}

	(0, _createClass3.default)(MdSelect, [{
		key: 'compile',
		value: function compile(element, attrs) {

			return {
				pre: function pre(scope, element, attrs, ngModel) {}
			};
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			MdSelect.instance = new MdSelect($rootScope, $state);
			return MdSelect.instance;
		}
	}]);
	return MdSelect;
}()) || _class);
exports.default = MdSelect;