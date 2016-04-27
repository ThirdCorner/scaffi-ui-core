'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Factory = exports.Directive = exports.Filter = exports.Service = exports.Config = exports.Run = exports.Inject = exports.RouteConfig = exports.View = exports.Component = exports.StateModel = exports.ParserHelper = exports.EnvironmentHelper = exports.DataCollection = exports.DataModel = exports.ValidationGeneratorHelper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-aria');

require('angular-animate');

require('angular-material');

require('angular-sanitize');

require('angular-messages');

require('angular-ui-router');

require('angular-loading-bar');

require('ng-table');

require('angular-breadcrumb');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('./ng-decorators');

var _ngDecorators2 = _interopRequireDefault(_ngDecorators);

var _validationGeneratorHelper = require('./helpers/validation-generator-helper');

var _validationGeneratorHelper2 = _interopRequireDefault(_validationGeneratorHelper);

var _dataModel = require('./classes/data-model');

var _dataModel2 = _interopRequireDefault(_dataModel);

var _dataCollection = require('./classes/data-collection');

var _dataCollection2 = _interopRequireDefault(_dataCollection);

var _environmentHelper = require('./helpers/environment-helper');

var _environmentHelper2 = _interopRequireDefault(_environmentHelper);

var _parserHelper = require('./helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _stateModel = require('./classes/state-model');

var _stateModel2 = _interopRequireDefault(_stateModel);

require('./config/config.dev');

require('./config/config.prototype');

require('./config/config.test');

require('./config/config.prod');

require('./config/config');

require('./components/components');

require('./directives/directives');

require('./factories/factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoreLoader = function () {
	function CoreLoader(args) {
		_classCallCheck(this, CoreLoader);

		if (!args.config) {
			throw new Error("You must pass the scaffi-ui config in the config property args");
		}
		if (!_lodash2.default.isObject(args.config)) {
			throw new Error("You must pass an object in the config args to initialize scaffi-ui");
		}

		if (!args.ENV) {
			throw new Error("ENV args var has not been set. Scaffi doesn't know to do prototype or not.");
		}
		this.ENV = args.ENV;
		this.config = args.config;

		if (!this.ENV) {
			throw new Error("ENV global var has not been set. Scaffi doesn't know to do prototype or not.");
		}

		console.log("CORE LOADED");
	}

	_createClass(CoreLoader, [{
		key: 'getConfig',
		value: function getConfig() {
			return this.config;
		}
	}, {
		key: 'getEnvironment',
		value: function getEnvironment() {
			return this.ENV;
		}
	}]);

	return CoreLoader;
}();

var coreLoader, initialized;
var returns = {
	initialize: function initialize(args) {
		coreLoader = new CoreLoader(args);

		var requires = [
		// angular modules
		'ngAnimate', 'ngMessages', 'ngSanitize',

		// 3rd party modules
		'ui.router', 'ngTable', 'angular-loading-bar', 'ncy-angular-breadcrumb'];

		_angular2.default.element(document).ready(function () {
			_angular2.default.bootstrap(document, [_ngDecorators2.default.name], {
				//strictDi: true
			});
		});

		_ngDecorators2.default.requires = _ngDecorators2.default.requires.concat(requires);
		initialized = true;
		return _ngDecorators2.default;
	},

	config: {
		_isLoaded: function _isLoaded() {
			return initialized ? true : false;
		},
		_throwLoadError: function _throwLoadError() {
			if (!this._isLoaded()) {
				throw new Error("Scaffi Core has not been loaded yet to be able to reference any of the config functions.");
			}
		},
		getLocalhostAddress: function getLocalhostAddress() {
			this._throwLoadError();
			return "localhost:" + coreLoader.getConfig().uiLocalhostPort;
		},
		getIdPropertyName: function getIdPropertyName() {
			this._throwLoadError();
			return coreLoader.getConfig().idName;
		},
		getParentIdName: function getParentIdName(parentName) {
			this._throwLoadError();
			/*
   	TODO this needs to be transformed
    */
			return parentName + coreLoader.getConfig().idName;
		},
		getApiBase: function getApiBase() {
			this._throwLoadError();
			return coreLoader.getConfig().apiRoute;
		},
		getEnvironment: function getEnvironment() {
			return coreLoader.getEnvironment();
		}
	},
	transformColumnName: function transformColumnName(name) {}
};

exports.default = returns;
exports.ValidationGeneratorHelper = _validationGeneratorHelper2.default;
exports.DataModel = _dataModel2.default;
exports.DataCollection = _dataCollection2.default;
exports.EnvironmentHelper = _environmentHelper2.default;
exports.ParserHelper = _parserHelper2.default;
exports.StateModel = _stateModel2.default;
exports.Component = _ngDecorators.Component;
exports.View = _ngDecorators.View;
exports.RouteConfig = _ngDecorators.RouteConfig;
exports.Inject = _ngDecorators.Inject;
exports.Run = _ngDecorators.Run;
exports.Config = _ngDecorators.Config;
exports.Service = _ngDecorators.Service;
exports.Filter = _ngDecorators.Filter;
exports.Directive = _ngDecorators.Directive;
exports.Factory = _ngDecorators.Factory;