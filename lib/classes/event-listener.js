'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventListener = function () {
	function EventListener(scope) {
		_classCallCheck(this, EventListener);

		this.listeners = {
			_all: []
		};
		this.scope = scope || {};
	}

	_createClass(EventListener, [{
		key: 'onBubble',
		value: function onBubble(eventFn) {
			this.on("_bubble", eventFn);
		}
	}, {
		key: 'bubble',
		value: function bubble(event) {
			if (!event) {
				return false;
			}

			var sendArgs = [];
			_lodash2.default.each(arguments, function (value, key) {
				sendArgs.push(value);
			});

			sendArgs.unshift("_bubble");

			this.trigger.apply(this, sendArgs);
		}
	}, {
		key: 'on',
		value: function on(event, callback) {
			if (arguments.length == 2) {
				if (!this.listeners[event]) {
					this.listeners[event] = [];
				}

				this.listeners[event].push(callback);
			} else if (arguments.length == 1 && _lodash2.default.isFunction(event)) {
				this.listeners['_all'].push(event);
			}
		}
	}, {
		key: 'triggerBubble',
		value: function triggerBubble() {
			var sendArgs = [];
			_lodash2.default.each(arguments, function (value, key) {
				sendArgs.push(value);
			});
			sendArgs.unshift("_bubble");
			this.trigger.apply(this, sendArgs);
		}
	}, {
		key: 'trigger',
		value: function trigger(event) {
			var _this = this;

			if (!arguments) {
				return false;
			}

			event = arguments[0];
			var trimCount = 0;

			var isBubbling = false;
			if (event == "_bubble") {
				isBubbling = true;
				trimCount = 1;
				event = arguments[1];
			}

			var sendArgs = [];
			_lodash2.default.each(arguments, function (value, key) {

				if (key > trimCount) {
					sendArgs.push(value);
				}
			});

			if (this.listeners[event]) {
				_lodash2.default.each(this.listeners[event], function (eventFn) {
					if (eventFn.apply(_this.scope, sendArgs) === false) {
						/*
      Todo: Add logic to stop the bubble up. Right now it'll just go to the top
       */
					}
				}, this);
			}

			sendArgs.unshift(event);
			if (this.listeners._all.length) {
				_lodash2.default.each(this.listeners._all, function (eventFn) {
					eventFn.apply(_this.scope, sendArgs);
				}, this);
			}

			if (isBubbling) {
				if (!this.listeners._bubble) {
					return false;
				}

				_lodash2.default.each(this.listeners._bubble, function (event) {
					event.apply(_this.scope, sendArgs);
				}, this);
			}
		}
	}]);

	return EventListener;
}();

exports.default = EventListener;