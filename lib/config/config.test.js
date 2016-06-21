'use strict';

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _desc, _value, _class, _dec2, _desc2, _value2, _class2; // jshint unused: false


require('angular-mocks');

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _ngDecorators = require('../ng-decorators');

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var OnConfigTest = (_dec = (0, _ngDecorators.Config)(), (_class = function () {
	function OnConfigTest() {
		(0, _classCallCheck3.default)(this, OnConfigTest);
	}

	(0, _createClass3.default)(OnConfigTest, null, [{
		key: 'configFactory',

		//end-non-standard
		value: function configFactory($provide) {
			if (_index2.default.config.getEnvironment() == "test") {
				console.log("config test");
			}
		}
	}]);
	return OnConfigTest;
}(), (_applyDecoratedDescriptor(_class, 'configFactory', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class, 'configFactory'), _class)), _class));
var OnRunTest = (_dec2 = (0, _ngDecorators.Run)(), (_class2 = function () {
	function OnRunTest() {
		(0, _classCallCheck3.default)(this, OnRunTest);
	}

	(0, _createClass3.default)(OnRunTest, null, [{
		key: 'runFactory',

		//end-non-standard
		value: function runFactory($rootScope) {
			if (_index2.default.config.getEnvironment() == "test") {
				$rootScope.ENV = "test";
			}
		}
	}]);
	return OnRunTest;
}(), (_applyDecoratedDescriptor(_class2, 'runFactory', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class2, 'runFactory'), _class2)), _class2));