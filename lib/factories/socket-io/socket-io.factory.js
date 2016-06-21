'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class; // jshint unused: false


var _ngDecorators = require('../../ng-decorators');

var _parserHelper = require('../../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
TODO need to add a live edit config to scaffi-ui
 */
var LIVE_EDITS = false;

//end-non-standard

//start-non-standard
var SocketIO = (_dec = (0, _ngDecorators.Factory)({
	factoryName: 'socketIO'
}), _dec(_class = function () {
	function SocketIO($rootScope) {
		(0, _classCallCheck3.default)(this, SocketIO);


		if (LIVE_EDITS) {
			var url = window.location.hostname + ":3000";
			this.socket = io.connect(url);

			this.$rootScope = $rootScope;
		}
	}

	(0, _createClass3.default)(SocketIO, [{
		key: 'on',
		value: function on(eventName, callback) {
			if (!LIVE_EDITS) {
				return false;
			}

			var that = this;

			// console.log("ON SOCKET: ", eventName);
			var socket = this.socket;
			socket.on(eventName, function () {
				var args = [];
				_lodash2.default.each(arguments, function (value) {
					args.push(value);
				});

				_parserHelper2.default.convertToApp(args);
				that.$rootScope.$apply(function () {

					callback.apply(socket, args);
				});
			});
		}
	}, {
		key: 'emit',
		value: function emit(eventName, data, callback) {
			if (!LIVE_EDITS) {
				return false;
			}
			var that = this;
			var socket = this.socket;
			socket.emit(eventName, data, function () {
				var args = arguments;
				that.$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	}], [{
		key: 'factory',
		value: function factory($rootScope) {
			SocketIO.instance = new SocketIO($rootScope);
			return SocketIO.instance;
		}
	}]);
	return SocketIO;
}()) || _class);
exports.default = SocketIO;