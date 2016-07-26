'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _responseLogger = require('./response-logger');

var _responseLogger2 = _interopRequireDefault(_responseLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorLogger = function () {
	function ErrorLogger() {
		var _this = this;

		(0, _classCallCheck3.default)(this, ErrorLogger);

		this.listeners = [];
		_responseLogger2.default.onErrorResponse(function (event) {
			var response = event.response;
			if (response && response.status) {
				response.statusCode = response.status;
			}

			_this.fireError("server", response);
		});
	}

	(0, _createClass3.default)(ErrorLogger, [{
		key: 'fireError',
		value: function fireError(type, error) {

			var setError = {};
			if (error instanceof Error) {
				/*
     So we can stop server calls from continuing
     */
				if (error.message == "Halt") {
					return true;
				}
				setError = { name: error.name, message: error.message };
				if (error.stack) {
					setError.stack = error.stack.split("\n");
				}
			} else {
				try {
					setError = JSON.parse((0, _stringify2.default)(error));
					if (setError && setError.status) {
						setError.statusCode = setError.status;
					}
				} catch (e) {
					setError = { error: "Couldn't stringify error" };
				}
			}

			_lodash2.default.each(this.listeners, function (event) {
				if (_lodash2.default.isFunction(event)) {
					event({ type: type, error: setError });
				}
			}, this);
		}
	}, {
		key: 'onError',
		value: function onError(event) {
			this.listeners.push(event);
		}
	}]);
	return ErrorLogger;
}();

exports.default = new ErrorLogger();