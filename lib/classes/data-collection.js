'use strict';

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _dataModel = require('./data-model');

var _dataModel2 = _interopRequireDefault(_dataModel);

var _eventListener = require('./event-listener');

var _eventListener2 = _interopRequireDefault(_eventListener);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ID_PROP;


module.exports = function () {

	/*
  From: http://www.bennadel.com/blog/2292-extending-javascript-arrays-while-keeping-native-bracket-notation-functionality.htm
  */

	// I am the constructor function.
	function Collection() {

		// When creating the collection, we are going to work off
		// the core array. In order to maintain all of the native
		// array features, we need to build off a native array.
		var collection = (0, _create2.default)(Array.prototype);

		// Initialize the array. This line is more complicated than
		// it needs to be, but I'm trying to keep the approach
		// generic for learning purposes.
		collection = Array.apply(collection, arguments) || collection;

		// Add all the class methods to the collection.
		Collection.injectClassMethods(collection);

		// Return the new collection object.
		return collection;
	}

	// Define the static methods.
	Collection.injectClassMethods = function (collection) {

		// Loop over all the prototype methods and add them
		// to the new collection.
		for (var method in Collection.prototype) {

			// Make sure this is a local method.
			if (Collection.prototype.hasOwnProperty(method)) {

				// Add the method to the collection.
				collection[method] = Collection.prototype[method];
			}
		}

		// Return the updated collection.
		return collection;
	};

	Collection.prototype = {
		init: function init(Service, data, stateModel) {
			var _this = this,
			    _arguments = arguments;

			ID_PROP = _index2.default.config.getIdPropertyName();

			this.setServerTotal(0);
			if (data) {
				if (_lodash2.default.has(data, "inlineCount")) {
					this.setServerTotal(data.inlineCount);
				}
				if (_lodash2.default.has(data, "results")) {
					data = data.results;
				}
			}

			if (!_lodash2.default.isArray(data)) {
				data = [];
			}

			this._service = Service;
			this._stateModel = stateModel;

			if (!stateModel) {
				throw new Error("Rest Collection doesn't have state model");
			}
			this._setSocketConnection();

			_lodash2.default.each(data, function (value) {
				_this.push(value);
			}, this);

			var that = this;
			this._events = new _eventListener2.default({
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

			this._parentLink = null;
		},
		onCustom: function onCustom(event, fn) {
			this._events.on(event, fn);
		},
		onBubble: function onBubble(bubbleFn) {
			this._events.onBubble(bubbleFn);
		},
		onUpdate: function onUpdate(updateFn) {
			this._events.on("update", updateFn);
		},
		onCreate: function onCreate(createFn) {
			this._events.on("create", createFn);
		},
		onDelete: function onDelete(deleteFn) {
			this._events.on("delete", deleteFn);
		},
		updateData: function updateData(eventName, fetchedData) {
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
		},
		_setSocketConnection: function _setSocketConnection() {
			// add destroy listeners

			var listener = "create:" + this._service.getPropertyName();
			if (this._hasBaseNamespace()) {
				listener += this._getBaseNamespace();
			}

			var that = this;
			this._stateModel.getSocket().on(listener, that._stateModel.getUpdateCallback(listener));
		},
		_getBaseNamespace: function _getBaseNamespace() {
			return this._baseNamespace;
		},
		_hasBaseNamespace: function _hasBaseNamespace() {
			return this._baseNamespace ? true : false;
		},
		_setBaseNamespace: function _setBaseNamespace(baseNamespace) {
			this._baseNamespace = baseNamespace;
		},

		/*
   This lets the collection request a parent link if it has one for when we push new models
   */
		_setParentLinkFunction: function _setParentLinkFunction(fn) {
			this._parentLink = fn;
		},
		filter: function filter(filterEvent) {
			if (filterEvent) {
				this._filterEvent = filterEvent;
			}

			if (this._filterEvent) {
				this.filtered = _lodash2.default.filter(this, this._filterEvent);
			}
		},
		getServerTotal: function getServerTotal() {
			return this._inlineCount;
		},
		setServerTotal: function setServerTotal(count) {
			this._inlineCount = count;
			if (this._inlineCount == 0) {
				this.length = 0;
			}
		},
		push: function push(data) {
			if (!_lodash2.default.isObject(data)) {
				data = {};
			}

			if (data instanceof _dataModel2.default) {
				data = data.export();
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
		},
		removeItem: function removeItem(model) {
			var foundIndex = null;
			this.forEach(function (item, index) {
				if (item[ID_PROP] == model[ID_PROP]) {
					foundIndex = index;
				}
			});

			if (!_lodash2.default.isNull(foundIndex) && this.length > foundIndex) {
				Array.prototype.splice.call(this, foundIndex, 1);
			}
		},
		_export: function _export() {
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
	};

	// Return the collection constructor.
	return Collection;
}.call({});