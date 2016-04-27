'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class; // jshint unused: false


var _ngDecorators = require('../../ng-decorators');

var _index = require('../../index.js');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		_classCallCheck(this, SocketIO);

		if (LIVE_EDITS) {
			var url = window.location.hostname + ":3000";
			this.socket = io.connect(url);

			this.$rootScope = $rootScope;
		}
	}

	_createClass(SocketIO, [{
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

				_index.ParserHelper.convertToApp(args);
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