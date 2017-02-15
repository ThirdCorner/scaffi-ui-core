'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AbstractBootstrap = exports.AbstractMaterial = exports.Factory = exports.Directive = exports.Filter = exports.Service = exports.Config = exports.Run = exports.Inject = exports.RouteConfig = exports.View = exports.Component = exports.ResponseLogger = exports.ErrorLogger = exports.AbstractPage = exports.AbstractComponent = exports.MockHttpFallthrough = exports.AbstractStubPage = exports.AbstractService = exports.MockHttp = exports.StateModel = exports.ParserHelper = exports.EnvironmentHelper = exports.DataCollection = exports.DataModel = exports.ValidationGeneratorHelper = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-aria');

require('angular-animate');

require('angular-sanitize');

require('angular-messages');

require('angular-ui-router');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('./ng-decorators');

var _ngDecorators2 = _interopRequireDefault(_ngDecorators);

var _validationGeneratorHelper = require('./helpers/validation-generator-helper');

var _validationGeneratorHelper2 = _interopRequireDefault(_validationGeneratorHelper);

var _dataModel = require('./classes/data-model');

var _dataModel2 = _interopRequireDefault(_dataModel);

var _environmentHelper = require('./helpers/environment-helper');

var _environmentHelper2 = _interopRequireDefault(_environmentHelper);

var _parserHelper = require('./helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _stateModel = require('./classes/state-model');

var _stateModel2 = _interopRequireDefault(_stateModel);

var _mockHttp = require('./classes/mock-http');

var _mockHttp2 = _interopRequireDefault(_mockHttp);

var _abstractService = require('./classes/abstract-service');

var _abstractService2 = _interopRequireDefault(_abstractService);

var _abstractStubPage = require('./classes/abstract-stub-page');

var _abstractStubPage2 = _interopRequireDefault(_abstractStubPage);

var _abstractPage = require('./classes/abstract-page');

var _abstractPage2 = _interopRequireDefault(_abstractPage);

var _abstractComponent = require('./classes/abstract-component');

var _abstractComponent2 = _interopRequireDefault(_abstractComponent);

var _mockHttpFallthrough = require('./classes/mock-http-fallthrough');

var _mockHttpFallthrough2 = _interopRequireDefault(_mockHttpFallthrough);

var _responseLogger = require('./classes/response-logger');

var _responseLogger2 = _interopRequireDefault(_responseLogger);

var _errorLogger = require('./classes/error-logger');

var _errorLogger2 = _interopRequireDefault(_errorLogger);

var _abstractMaterial = require('./themes/material/abstract-material');

var _abstractMaterial2 = _interopRequireDefault(_abstractMaterial);

var _abstractBootstrap = require('./themes/bootstrap/abstract-bootstrap');

var _abstractBootstrap2 = _interopRequireDefault(_abstractBootstrap);

require('./config/config.dev');

require('./config/config.prototype');

require('./config/config.test');

require('./config/config.prod');

require('./config/config');

require('./components/components');

require('./directives/directives');

require('./factories/factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataCollection = require('./classes/data-collection');

/*
	Themes
 */

var ENV_MODES = ["production", "development", "qa", "localhost", "prototype", "ci"];

var CoreLoader = function () {
	function CoreLoader(args) {
		(0, _classCallCheck3.default)(this, CoreLoader);


		if (!args.config) {
			throw new Error("You must pass the scaffi-ui config in the library initialize function args");
		}
		if (!_lodash2.default.isObject(args.config)) {
			throw new Error("You must pass an object in the config args to initialize scaffi-ui");
		}

		if (!_lodash2.default.has(args, "theme")) {
			throw new Error("You must pass a theme args that extends AbstractTheme. You did not do that. Bad person");
		}

		this.theme = args.theme;

		if (args.private && (!_lodash2.default.isObject(args.private) || !_lodash2.default.isObject(args.private.config))) {
			throw new Error("You're providing a private config which is not an object structure. Bad Human");
		}

		this.config = args.config;

		if (args.private) {
			this.mergeConfigs(args.private);
		}

		if (!this.config.config.environment) {
			throw new Error("config.environment is not provided. Scaffi doesn't know to do prototype or not.");
		}

		if (!this.config.config.platform) {
			throw new Error("config.platform is not provided. Scaffi doesn't know if this is web or not.");
		}

		if (ENV_MODES.indexOf(this.config.config.environment) === -1) {
			throw new Error("Invalid environment supplied: " + this.config.config.environment + ". Expect one of the following: " + ENV_MODES.join(", "));
		}
	}

	(0, _createClass3.default)(CoreLoader, [{
		key: 'initializeTheme',
		value: function initializeTheme(appModule) {
			this.theme = new this.theme({
				appModule: appModule
			});
		}
	}, {
		key: 'mergeConfigs',
		value: function mergeConfigs(privateConfig) {
			var _this = this;

			if (!this.config.config) {
				this.config.config = {};
			}
			_lodash2.default.forEach(privateConfig.config, function (item, name) {
				_this.config.config[name] = item;
			});
		}
	}, {
		key: 'getConfigProperty',
		value: function getConfigProperty(name) {
			if (_lodash2.default.has(this.config.config, name)) {
				return this.config.config[name];
			}
			return null;
		}
	}, {
		key: 'getConfig',
		value: function getConfig() {
			return this.config;
		}
	}, {
		key: 'getEnvironment',
		value: function getEnvironment() {
			return this.getConfigProperty("environment");
		}
	}, {
		key: 'getPlatform',
		value: function getPlatform() {
			return this.getConfigProperty("platform");
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
		'ui.router'];

		_angular2.default.element(document).ready(function () {
			_angular2.default.bootstrap(document, [_ngDecorators2.default.name], {
				//strictDi: true
			});
		});

		_ngDecorators2.default.config(function () {
			/*
    Browser Support Fillers
    */

			/**
    * Hack in support for Function.name for browsers that don't support it.
    * IE, I'm looking at you.
    **/
			if (Function.prototype.name === undefined && _defineProperty2.default !== undefined) {
				Object.defineProperty(Function.prototype, 'name', {
					get: function get() {
						var funcNameRegex = /function\s([^(]{1,})\(/;
						var results = funcNameRegex.exec(this.toString());
						return results && results.length > 1 ? results[1].trim() : "";
					},
					set: function set(value) {}
				});
			}
		});

		_ngDecorators2.default.requires = _ngDecorators2.default.requires.concat(requires);

		_ngDecorators2.default.config(function ($provide) {
			$provide.decorator("$exceptionHandler", function ($delegate) {
				return function (exception, cause) {

					_errorLogger2.default.fireError("ui", exception);
					$delegate(exception, cause);
				};
			});
		});

		/*
  	Adding for cookie capabilities enabled since we have it defaulted on server to work
   */
		_ngDecorators2.default.config(function ($httpProvider) {
			$httpProvider.defaults.withCredentials = true;
			//rest of route code
		});

		/*
  	This disables caching on IE11 if you don't have the console opened
  	Was running into this when we had a list pagination page without
  	any GET params 
   */
		_ngDecorators2.default.config(function ($httpProvider) {
			if (!$httpProvider.defaults.headers.get) {
				$httpProvider.defaults.headers.get = {};
			}

			$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
			$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
		});

		initialized = true;

		coreLoader.initializeTheme(_ngDecorators2.default);

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
			return "localhost:" + coreLoader.getConfigProperty("uiLocalhostPort");
		},
		getIdPropertyName: function getIdPropertyName() {
			this._throwLoadError();
			return coreLoader.getConfigProperty("idName");
		},
		getParentIdName: function getParentIdName(parentName) {
			this._throwLoadError();
			/*
   	TODO this needs to be transformed
    */
			return parentName + coreLoader.getConfigProperty("idName");
		},
		getVersion: function getVersion() {
			this._throwLoadError();
			return coreLoader.getConfigProperty("version") || "???";
		},
		getApiBase: function getApiBase() {
			this._throwLoadError();
			var url = coreLoader.getConfigProperty("apiRoute");

			var base = coreLoader.getConfigProperty("domain");

			if (coreLoader.getEnvironment() == "localhost" && coreLoader.getPlatform() == "web") {
				base = "localhost:" + coreLoader.getConfigProperty("serverLocalhostPort");
			}

			if (!base) {
				return url;
			}

			if (!_lodash2.default.startsWith(base, "http") && !_lodash2.default.startsWith(base, "https")) {
				base = "http://" + base;
			}

			return base + url;
		},
		isProductionMode: function isProductionMode() {
			return coreLoader.getEnvironment() === "production";
		},
		isDevelopmentMode: function isDevelopmentMode() {
			return coreLoader.getEnvironment() === "development";
		},
		isQaMode: function isQaMode() {
			return coreLoader.getEnvironment() === "qa";
		},
		isLocalhostMode: function isLocalhostMode() {
			return coreLoader.getEnvironment() === "localhost";
		},
		isPrototypeMode: function isPrototypeMode() {
			return coreLoader.getEnvironment() === "prototype";
		},
		isCiMode: function isCiMode() {
			return coreLoader.getEnvironment() === "ci";
		},
		getEnvironment: function getEnvironment() {
			return coreLoader.getEnvironment();
		},
		getPlatform: function getPlatform() {
			return coreLoader.getPlatform();
		},
		isWebPlatform: function isWebPlatform() {
			return coreLoader.getPlatform() === "web";
		},
		isIosPlatform: function isIosPlatform() {
			return coreLoader.getPlatform() === "ios";
		},
		isAndroidPlatform: function isAndroidPlatform() {
			return coreLoader.getPlatform() === "android";
		},
		isMobilePlatform: function isMobilePlatform() {
			return coreLoader.getPlatform() === "ios" || coreLoader.getPlatform() === "android";
		}
	},
	transformColumnName: function transformColumnName(name) {}
};

exports.default = returns;
exports.ValidationGeneratorHelper = _validationGeneratorHelper2.default;
exports.DataModel = _dataModel2.default;
exports.DataCollection = DataCollection;
exports.EnvironmentHelper = _environmentHelper2.default;
exports.ParserHelper = _parserHelper2.default;
exports.StateModel = _stateModel2.default;
exports.MockHttp = _mockHttp2.default;
exports.AbstractService = _abstractService2.default;
exports.AbstractStubPage = _abstractStubPage2.default;
exports.MockHttpFallthrough = _mockHttpFallthrough2.default;
exports.AbstractComponent = _abstractComponent2.default;
exports.AbstractPage = _abstractPage2.default;
exports.ErrorLogger = _errorLogger2.default;
exports.ResponseLogger = _responseLogger2.default;
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
exports.AbstractMaterial = _abstractMaterial2.default;
exports.AbstractBootstrap = _abstractBootstrap2.default;