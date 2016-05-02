/*
	This is to be loaded after all other routes so we can intercept mock routes that aren't declared.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _ngDecorators = require('../ng-decorators');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		_classCallCheck(this, MockHttpFallthrough);
	}

	_createClass(MockHttpFallthrough, [{
		key: 'runFactory',

		//end-non-standard
		value: function runFactory($httpBackend) {
			if (_index2.default.config.getEnvironment() != "prototype") {
				return false;
			}
			/*
    Full stop passthrough
    */

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
		}
	}]);

	return MockHttpFallthrough;
}(), (_applyDecoratedDescriptor(_class.prototype, 'runFactory', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'runFactory'), _class.prototype)), _class));
exports.default = MockHttpFallthrough;