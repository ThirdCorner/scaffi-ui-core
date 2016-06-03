'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ErrorLogging = function () {
	function ErrorLogging() {
		_classCallCheck(this, ErrorLogging);

		this.errors = [];
		this.listeners = [];
	}

	_createClass(ErrorLogging, [{
		key: 'fireError',
		value: function fireError(type, error) {
			var _this = this;

			this.errors.push({ type: type, error: error });
			_lodash2.default.each(this.listeners, function (event) {
				if (_lodash2.default.isFunction(event)) {
					event(_this.errors);
				}
			}, this);
		}
	}, {
		key: 'clearErrors',
		value: function clearErrors() {
			this.errors = [];
		}
	}, {
		key: 'onError',
		value: function onError(event) {
			this.listeners.push(event);
		}
	}]);

	return ErrorLogging;
}();

exports.default = new ErrorLogging();