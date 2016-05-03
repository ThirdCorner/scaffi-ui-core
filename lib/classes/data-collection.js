'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataModel = require('./data-model');

var _dataModel2 = _interopRequireDefault(_dataModel);

var _eventListener = require('./event-listener');

var _eventListener2 = _interopRequireDefault(_eventListener);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ID_PROP;

var DataCollection = function (_Array) {
	_inherits(DataCollection, _Array);

	/*
 	fireUpdateParent fn that tells first node parent to refresh its data
  */

	function DataCollection(Service, data, stateModel) {
		var _arguments = arguments;

		_classCallCheck(this, DataCollection);

		ID_PROP = _index2.default.config.getIdPropertyName();

		var inlineCount = 0;
		if (data) {
			if (_lodash2.default.has(data, "inlineCount")) {
				inlineCount = data.inlineCount;
			}
			if (_lodash2.default.has(data, "results")) {
				data = data.results;
			}
		}

		if (!_lodash2.default.isArray(data)) {
			data = [];
		}

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataCollection).call(this));

		_this._service = Service;
		_this._stateModel = stateModel;

		if (!stateModel) {
			throw new Error("Rest Collection doesn't have state model");
		}
		_this._setSocketConnection();

		_this._inlineCount = inlineCount;

		_lodash2.default.each(data, function (value) {
			_this.push(value);
		}, _this);

		var that = _this;
		_this._events = new _eventListener2.default({
			bubble: function bubble() {
				that._events.bubble.apply(that._events, _arguments);
			},
			hasStatus: function hasStatus(search) {},
			get: function get(prop) {
				if (_lodash2.default.has(that, prop) && that[prop]) {
					return that[prop];
				}
			},
			set: function set(prop, value) {}
		});

		_this._parentLink = null;

		return _this;
	}

	_createClass(DataCollection, [{
		key: 'onCustom',
		value: function onCustom(event, fn) {
			this._events.on(event, fn);
		}
	}, {
		key: 'onBubble',
		value: function onBubble(bubbleFn) {
			this._events.onBubble(bubbleFn);
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
		value: function updateData(eventName, fetchedData) {
			var _this2 = this;

			if (_lodash2.default.has(fetchedData, "results")) {
				fetchedData = fetchedData.results;
			}

			if (!_lodash2.default.isArray(fetchedData)) {
				console.log(fetchedData);
				throw new Error("Trying to update collection with a non-array");
			}

			var currentIds = [];
			this.forEach(function (item, index, array) {
				currentIds.push(item[ID_PROP]);
			});

			var needToAdd = _lodash2.default.filter(fetchedData, function (checkModel) {
				return currentIds.indexOf(checkModel[ID_PROP]) === -1;
			});

			this.forEach(function (item, index, array) {
				var found = _lodash2.default.find(fetchedData, function (check) {
					return check[ID_PROP] === item[ID_PROP];
				});

				if (found) {
					item.updateData(eventName, found);
				}
			});

			_lodash2.default.each(needToAdd, function (model) {
				_this2.push(model);
			}, this);
		}
	}, {
		key: '_setSocketConnection',
		value: function _setSocketConnection() {
			// add destroy listeners

			var listener = "create:" + this._service.getPropertyName();
			if (this._hasBaseNamespace()) {
				listener += this._getBaseNamespace();
			}

			var that = this;
			this._stateModel.getSocket().on(listener, that._stateModel.getUpdateCallback(listener));
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
		/*
   This lets the collection request a parent link if it has one for when we push new models
   */

	}, {
		key: '_setParentLinkFunction',
		value: function _setParentLinkFunction(fn) {
			this._parentLink = fn;
		}
	}, {
		key: 'filter',
		value: function filter(filterEvent) {
			if (filterEvent) {
				this._filterEvent = filterEvent;
			}

			if (this._filterEvent) {
				this.filtered = _lodash2.default.filter(this, this._filterEvent);
			}
		}
	}, {
		key: 'getServerTotal',
		value: function getServerTotal() {
			return this._inlineCount;
		}
	}, {
		key: 'setServerTotal',
		value: function setServerTotal(count) {
			this._inlineCount = count;
		}
	}, {
		key: 'push',
		value: function push(data) {
			if (!_lodash2.default.isObject(data)) {
				data = {};
			}

			var model = new _dataModel2.default(this._service, data, this._stateModel);

			if (this._hasBaseNamespace()) {
				model._setBaseNamespace(this._getBaseNamespace());
			}

			if (_lodash2.default.isFunction(this._parentLink)) {
				this._parentLink(model);
			}

			var that = this;
			model.onDelete(function () {
				that.removeItem(model);
			});

			/*
   	Babel won't convert this correctly if we change from function(){} to ()=>{}
   	We'll lose the first argument if we do that for some reason.
    */
			var modelFn = function modelFn() {
				var sendArgs = [];
				_lodash2.default.each(arguments, function (value, key) {
					sendArgs.push(value);
				});

				that._events.trigger.apply(that._events, sendArgs);
			};
			model.onUpdate(modelFn);
			model.onCreate(modelFn);
			model.onDelete(modelFn);
			model.onStateChange(modelFn);
			model.onBubble(function () {
				var sendArgs = [];
				_lodash2.default.each(arguments, function (value, key) {
					sendArgs.push(value);
				});
				that._events.triggerBubble.apply(that._events, sendArgs);
			});

			if (this._service) {
				this._service.configDataModel(model);
			}

			Array.prototype.push.call(this, model);
			return model;
		}
	}, {
		key: 'removeItem',
		value: function removeItem(model) {
			var foundIndex = null;
			this.forEach(function (item, index) {
				if (item[ID_PROP] == model[ID_PROP]) {
					foundIndex = index;
				}
			});

			if (!_lodash2.default.isNull(foundIndex) && this.length > foundIndex) {
				Array.prototype.splice.call(this, foundIndex, 1);
			}
		}
	}, {
		key: '_export',
		value: function _export() {
			if (this.length === 0) {
				return [];
			}

			var data = Array.prototype.slice.call(this);

			_lodash2.default.each(data, function (value, key) {
				if (value instanceof _dataModel2.default) {
					data[key] = value.export();
				}
			}, this);

			return data;
		}
	}]);

	return DataCollection;
}(Array);

exports.default = DataCollection;