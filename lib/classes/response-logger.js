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

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResponseLogger = function () {
	function ResponseLogger() {
		(0, _classCallCheck3.default)(this, ResponseLogger);

		this.listeners = [];
		this.errorListeners = [];
	}
	/*
 	type - get, resource, list, post, put, delete
  */


	(0, _createClass3.default)(ResponseLogger, [{
		key: 'fire',
		value: function fire(type, response) {
			var status = response && response.status ? response.status : 500;
			_lodash2.default.each(this.listeners, function (event) {
				if (_lodash2.default.isFunction(event)) {
					event({ type: type, response: response, status: status });
				}
			}, this);

			if (response && response.status == -1 && _index2.default.config.isPrototypeMode()) {
				return response;
			}

			if (!this.isSuccess(response)) {
				_lodash2.default.each(this.errorListeners, function (event) {
					if (_lodash2.default.isFunction(event)) {
						event({ type: type, response: response, status: status });
					}
				});
			}
		}
	}, {
		key: 'isSuccess',
		value: function isSuccess(response) {
			return response && response.status > 199 && response.status < 300;
		}
	}, {
		key: 'onErrorResponse',
		value: function onErrorResponse(event) {
			this.errorListeners.push(event);
		}
	}, {
		key: 'onResponse',
		value: function onResponse(event) {
			this.listeners.push(event);
		}
	}]);
	return ResponseLogger;
}();

exports.default = new ResponseLogger();