/*
	This is to be loaded after all other routes so we can intercept mock routes that aren't declared.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _desc, _value, _class;

var _ngDecorators = require('../ng-decorators');

var _index = require('../index');

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

var MockHttpFallthrough = (_dec = (0, _ngDecorators.Run)(), (_class = function () {
	function MockHttpFallthrough() {
		(0, _classCallCheck3.default)(this, MockHttpFallthrough);
	}

	(0, _createClass3.default)(MockHttpFallthrough, [{
		key: 'runFactory',

		//end-non-standard
		value: function runFactory($httpBackend, postLoader) {
			if (!_index2.default.config.isPrototypeMode()) {
				return false;
			}
			/*
    Full stop passthrough
    */

			postLoader.add(function () {
				$httpBackend.whenGET(/^\/api\/.*/).respond(function (method, url, data, headers) {
					console.log("==========================");
					console.log("   MOCK API FALLTHROUGH   ");
					headers['Content-Type'] = 'application/json;version=1';
					console.log(url);
					throw new Error("No API Service call for " + url + " declared!");
					return [404];
				});
				$httpBackend.whenGET(/^\w+.*/).passThrough();
				$httpBackend.whenPOST(/^\w+.*/).passThrough();
			});
		}
	}]);
	return MockHttpFallthrough;
}(), (_applyDecoratedDescriptor(_class.prototype, 'runFactory', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'runFactory'), _class.prototype)), _class));
exports.default = MockHttpFallthrough;