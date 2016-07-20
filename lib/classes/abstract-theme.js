'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractTheme = function () {
	(0, _createClass3.default)(AbstractTheme, [{
		key: 'initialize',

		/*
  	Extendables
   */
		value: function initialize() {}

		/*
  	Class Logic
   */

	}]);

	function AbstractTheme(args) {
		(0, _classCallCheck3.default)(this, AbstractTheme);

		this.params = args || {};
		if (!this.params || !_lodash2.default.isObject(this.params)) {
			throw new Error("You must pass an object as the first param for initializing a theme");
		}

		if (!_lodash2.default.has(this.params, "appModule")) {
			throw new Error("You must pass the module returned from ScaffiUi.initialize");
		}

		this.initialize();
	}

	(0, _createClass3.default)(AbstractTheme, [{
		key: 'getApp',
		value: function getApp() {
			return this.params.appModule;
		}
	}, {
		key: 'addRequires',
		value: function addRequires(requiresArr) {
			var mainModule = this.getApp();
			mainModule.requires = mainModule.requires.concat(requiresArr);
		}
	}]);
	return AbstractTheme;
}();

exports.default = AbstractTheme;