'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _dataCollection = require('./data-collection');

var _dataCollection2 = _interopRequireDefault(_dataCollection);

var _eventListener = require('./event-listener');

var _eventListener2 = _interopRequireDefault(_eventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ID_PROP;

var DataModel = function () {
	function DataModel(Service, data, stateModel) {
		var _this = this;

		_classCallCheck(this, DataModel);

		ID_PROP = _index2.default.config.getIdPropertyName();

		this._service = Service;
		this._namespace = this._service.getPropertyName();

		this._stateModel = stateModel;

		if (_lodash2.default.isObject(data)) {
			_lodash2.default.each(data, function (value, key) {
				var setVar = value;

				setVar = _this.convertToDataCollection(key, setVar);

				_this[key] = setVar;
			}, this);

			this._setSocketListener();
		}

		var that = this;
		this._events = new _eventListener2.default({
			bubble: function bubble(event) {
				that._events.bubble.apply(that._events, arguments);
			},
			hasStatus: function hasStatus(search) {},
			get: function get(prop, ifFound) {
				if (_lodash2.default.has(that, prop) && that[prop]) {
					ifFound(that[prop]);
				}
			},
			set: function set(prop, value) {}
		});
	}

	_createClass(DataModel, [{
		key: '_on',
		value: function _on(event, callerFn) {
			if (arguments.length == 2) {
				this._events.on(event, callerFn);
			} else {
				this._events.on(event);
			}
		}
	}, {
		key: 'onBubble',
		value: function onBubble(eventFn) {
			this._events.onBubble(eventFn);
		}
	}, {
		key: 'onCustom',
		value: function onCustom(event, fn) {
			this._events.on(event, fn);
		}
	}, {
		key: 'onStateChange',
		value: function onStateChange(statusFn) {
			this._events.on("state", statusFn);
		}
	}, {
		key: 'onUpdate',
		value: function onUpdate(updateFn) {
			this._events.on("update", updateFn);
		}
	}, {
		key: 'onCreate',
		value: function onCreate(createFn) {
			this._events.on("create", createFn);
		}
	}, {
		key: 'onDelete',
		value: function onDelete(deleteFn) {
			this._events.on("delete", deleteFn);
		}
	}, {
		key: 'updateData',
		value: function updateData(event, data) {
			var _this2 = this;

			if (!_lodash2.default.isObject(data)) {
				return false;
			}

			_lodash2.default.each(data, function (value, key) {
				/*
    	Fill in any data not there. For instance, data
    	from the server will have an array, while a newly created model will not.
    	Nor will it have timestamps.
    	
     */
				if (!_lodash2.default.has(_this2, key)) {
					_this2[key] = value;
				} else {
					value = _this2[key];
				}
				/*
    	If the data structure came from the server, it needs to be converted into a rest collection
     */
				_this2[key] = value = _this2.convertToDataCollection(key, value);

				if (value instanceof _dataCollection2.default && _lodash2.default.has(data, key)) {
					value.updateData(event, data[key]);
				}
			}, this);
		}
	}, {
		key: 'convertToDataCollection',
		value: function convertToDataCollection(key, value) {
			if (_lodash2.default.isArray(value) && !(value instanceof _dataCollection2.default)) {
				var childService = this._service.getService(key);
				if (childService) {
					var that = this;
					value = new _dataCollection2.default(childService, value, this._stateModel);
					this._stateModel.setBaseLevel(this._service.getPropertyName() + "#" + this[ID_PROP]);
					value._setParentLinkFunction(function (model) {
						model[that._namespace + "Id"] = that[ID_PROP];
					});

					value.onBubble(function () {
						that._events.triggerBubble.apply(that._events, arguments);
					});

					if (that._service) {
						that._service.configDataCollection(value);
					}
				}
			}

			return value;
		}
	}, {
		key: '_setSocketListener',
		value: function _setSocketListener() {
			if (!this[ID_PROP]) {
				return;
			}

			var that = this;
			this._stateModel.getSocket().on("update:" + this._service.getPropertyName() + "#" + this[ID_PROP], function (struct) {
				if (_lodash2.default.isObject(struct) && !_lodash2.default.isArray(struct)) {
					_lodash2.default.each(struct, function (value, name) {
						that[name] = value;
					});
					that._events.trigger("update", struct);
				}
			});
			this._stateModel.getSocket().on("delete:" + this._service.getPropertyName() + "#" + this[ID_PROP], function () {
				that._events.trigger("delete");
			});

			this._stateModel.getSocket().on("state:" + this._service.getPropertyName() + "#" + this[ID_PROP], function (struct) {
				that.setState(struct.state);
			});
		}
	}, {
		key: 'hasState',
		value: function hasState(checkString) {
			if (!this._states) {
				return false;
			}
			return this._states.indexOf(checkString) !== -1;
		}
	}, {
		key: 'setState',
		value: function setState(changedState) {
			var _this3 = this;

			if (!this._service.states) {
				return false;
			}

			if (!this._states) {
				this._states = [];
			}
			var toSet = [];
			_lodash2.default.each(this._service.states, function (keys, name) {
				if (_lodash2.default.isArray(keys) && keys.indexOf(changedState) !== -1) {
					toSet.push(name);
				}
			}, this);

			if (toSet.length) {
				var removeStates = [];
				_lodash2.default.each(toSet, function (stateCategory) {
					_lodash2.default.each(_this3._states, function (currentState) {
						if (_lodash2.default.startsWith(currentState, stateCategory)) {
							removeStates.push(currentState);
						}
					}, _this3);
				}, this);

				if (removeStates.length) {
					_lodash2.default.each(removeStates, function (name) {
						_this3._states.splice(_this3._states.indexOf(name), 1);
					}, this);
				}

				_lodash2.default.each(toSet, function (setCategory) {
					_this3._states.push(setCategory + ":" + changedState);
					_this3._events.trigger("state", setCategory + ":" + changedState);
				}, this);
			}
		}
	}, {
		key: '_getBaseNamespace',
		value: function _getBaseNamespace() {
			return this._baseNamespace;
		}
	}, {
		key: '_hasBaseNamespace',
		value: function _hasBaseNamespace() {
			return this._baseNamespace ? true : false;
		}
	}, {
		key: '_setBaseNamespace',
		value: function _setBaseNamespace(baseNamespace) {
			this._baseNamespace = baseNamespace;
		}
	}, {
		key: 'setId',
		value: function setId(id) {
			if (typeof id == "string") {
				id = parseInt(id, 10);
			}
			this[ID_PROP] = id;

			this._setSocketListener();
		}
	}, {
		key: 'save',
		value: function save() {
			var that = this;
			this._service.submit(this.export()).then(function (data) {
				if (data[ID_PROP]) {
					that.setId(data[ID_PROP]);
					that._events.trigger("create", _defineProperty({}, ID_PROP, data[ID_PROP]));
				}
			});
		}
	}, {
		key: 'pushChanges',
		value: function pushChanges(name) {
			var sendStructure = {};
			sendStructure[ID_PROP] = this[ID_PROP];
			sendStructure[name] = this[name];
			this._service.submit(sendStructure);
			//console.log("CHANGING " , name, ": ", this[name]);
		}
	}, {
		key: 'delete',
		value: function _delete() {
			if (this[ID_PROP]) {
				this._service.delete(this[ID_PROP]);
			}
			this._events.trigger("delete");
		}
	}, {
		key: 'getNamespace',
		value: function getNamespace() {
			return this._namespace;
		}
	}, {
		key: 'export',
		value: function _export(data) {

			var returnObj = {};

			var parseData = this;
			if (data) {
				parseData = data;
			}

			_lodash2.default.each(parseData, function (value, key) {
				if (_lodash2.default.isFunction(value)) {
					return;
				}
				switch (true) {
					case value instanceof _dataCollection2.default:
						//returnObj[key] = value._export();
						break;
					case value instanceof DataModel:
						returnObj[key] = value.export();
						break;
					case _lodash2.default.isArray(value):
						// var returnArray = [];
						// _.each(value, (item)=>{
						// 	returnArray.push(this._export(item));
						// }, this);
						//returnObj[key] = returnArray;
						break;
					default:
						//console.log(parseData, key, _.isArray(value));
						if (key.indexOf("_") !== 0) {
							returnObj[key] = value;
						}

				}
			}, this);

			return returnObj;
		}
	}]);

	return DataModel;
}();

exports.default = DataModel;