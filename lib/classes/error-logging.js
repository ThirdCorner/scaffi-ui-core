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

var ErrorLogging = function () {
	function ErrorLogging() {
		(0, _classCallCheck3.default)(this, ErrorLogging);

		this.errors = [];
		this.listeners = [];
	}

	(0, _createClass3.default)(ErrorLogging, [{
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