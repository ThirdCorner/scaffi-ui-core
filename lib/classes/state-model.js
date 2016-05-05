'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataModel = require('./data-model');

var _dataModel2 = _interopRequireDefault(_dataModel);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataCollection = require('./data-collection');

var StateModel = function () {
	function StateModel(url, service, data, socketIO) {
		_classCallCheck(this, StateModel);

		this.url = url;
		this.service = service;
		this.socketIO = socketIO;

		this.parseData(data);
	}

	_createClass(StateModel, [{
		key: 'parseData',
		value: function parseData(data) {
			if (!data) {
				return null;
			}

			var inlineCount = null;
			/*
   	THis means it's a LIST pull
    */
			if (_lodash2.default.has(data, 'inlineCount')) {
				inlineCount = data.inlineCount;
				data = data.results || [];
			}

			if (_lodash2.default.isArray(data)) {
				this.data = new DataCollection();
				this.data.init(this.service, data, this);
				if (inlineCount) {
					this.data.setServerTotal(inlineCount);
				}
			} else {
				this.data = new _dataModel2.default(this.service, data, this);
			}
		}
	}, {
		key: 'hasBaseLevel',
		value: function hasBaseLevel() {
			return this.baselevel ? true : false;
		}
	}, {
		key: 'getBaseLevel',
		value: function getBaseLevel() {
			return this.baselevel;
		}
	}, {
		key: 'setBaseLevel',
		value: function setBaseLevel(baseLevel) {
			this.baselevel = baseLevel;
		}
	}, {
		key: 'getUpdateCallback',
		value: function getUpdateCallback(listener) {
			var that = this;
			return function () {
				that.service.call(that.url).then(function (data) {
					that.data.updateData(listener, data);
				});
			};
		}
	}, {
		key: 'getSocket',
		value: function getSocket() {
			return this.socketIO;
		}
	}, {
		key: 'getRest',
		value: function getRest() {
			return this.data;
		}
	}]);

	return StateModel;
}();

exports.default = StateModel;