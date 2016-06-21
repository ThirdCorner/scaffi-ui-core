'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _eventListener = require('./event-listener');

var _eventListener2 = _interopRequireDefault(_eventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ID_PROP;

var DataCollection = require('./data-collection');

var DataModel = function () {
	function DataModel(Service, data, stateModel) {
		var _this = this;

		(0, _classCallCheck3.default)(this, DataModel);

		ID_PROP = _index2.default.config.getIdPropertyName();

		this._service = Service;
		this._namespace = this._service.getPropertyName();

		this._stateModel = stateModel;
		if (!_lodash2.default.isObject(data)) {
			data = {};
		}

		this.setOriginalData(data);

		_lodash2.default.each(data, function (value, key) {
			var setVar = value;

			setVar = _this.convertToDataCollection(key, setVar);

			_this[key] = setVar;
		}, this);

		this._setSocketListener();

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

	(0, _createClass3.default)(DataModel, [{
		key: '_on',
		value: function _on(event, callerFn) {
			if (arguments.length == 2) {
				this._events.on(event, callerFn);
			} else {
				this._events.on(event);
			}
		}
	}, {
		key: 'getOriginalData',
		value: function getOriginalData() {
			return this._originalData || {};
		}
	}, {
		key: 'setOriginalData',
		value: function setOriginalData(data) {
			this._originalData = JSON.parse((0, _stringify2.default)(data));
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

				if (_this2._isDataCollection(value) && _lodash2.default.has(data, key)) {
					value.updateData(event, data[key]);
				}
			}, this);
		}
	}, {
		key: '_isDataCollection',
		value: function _isDataCollection(value) {
			return _lodash2.default.isArray(value) && _lodash2.default.has(value, "_inlineCount");
		}
	}, {
		key: 'convertToDataCollection',
		value: function convertToDataCollection(key, value) {

			if (_lodash2.default.isArray(value) && !this._isDataCollection(value)) {
				var childService = this._service.getService(key);
				if (childService) {
					var that = this;
					var instance = new DataCollection();
					instance.init(childService, value, this._stateModel);

					value = instance;

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
		/*
  	Model Calls
   */
		// Revert Data to last saved or fetched state

	}, {
		key: 'revert',
		value: function revert() {}
		/*
  	Server Calls
   */

	}, {
		key: 'save',
		value: function save() {
			var that = this;
			return this._service.save(this.export()).then(function (data) {
				if (data[ID_PROP]) {
					that.setId(data[ID_PROP]);
					that._events.trigger("create", (0, _defineProperty3.default)({}, ID_PROP, data[ID_PROP]));
				}
			});
		}
	}, {
		key: 'pushChanges',
		value: function pushChanges(name) {
			var sendStructure = {};
			sendStructure[ID_PROP] = this[ID_PROP];
			sendStructure[name] = this[name];
			return this._service.save(sendStructure);
			//console.log("CHANGING " , name, ": ", this[name]);
		}
	}, {
		key: 'delete',
		value: function _delete() {
			if (this[ID_PROP]) {
				return this._service.delete(this[ID_PROP]);
			}
			this._events.trigger("delete");
		}
	}, {
		key: 'getNamespace',
		value: function getNamespace() {
			return this._namespace;
		}
	}, {
		key: 'filter',
		value: function filter() {
			throw new Error("There's no use case to filter items on a DataModel. Did you expect this to be a DataCollection? Check your code, boyo.");
		}
	}, {
		key: 'export',
		value: function _export(data) {
			var _this4 = this;

			var returnObj = {};

			var parseData = this;
			if (data) {
				parseData = data;
			}

			_lodash2.default.each(parseData, function (value, key) {
				if (_lodash2.default.isFunction(value)) {
					return;
				}
				/*
    	We don't want to export private vars
     */
				if (key && _lodash2.default.isString(key) && (key.indexOf("_") === 0 || key.indexOf("$$") === 0)) {
					return;
				}
				switch (true) {
					case _this4._isDataCollection(value):
						returnObj[key] = value._export();
						break;
					case value instanceof DataModel:
						returnObj[key] = value.export();
						break;
					/*
     	Not every model can have a child model that has a route. Some routes have nested arrays
     	that will be parsed when sent to the server
      */
					case _lodash2.default.isArray(value):
						var returnArray = [];
						_lodash2.default.each(value, function (item) {
							returnArray.push(_this4.export(item));
						}, _this4);
						returnObj[key] = returnArray;
						break;
					default:
						returnObj[key] = value;

				}
			}, this);

			return returnObj;
		}
	}]);
	return DataModel;
}();

exports.default = DataModel;