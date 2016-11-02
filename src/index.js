'use strict';

import angular from "angular";
import 'angular-aria';
import 'angular-animate';
import 'angular-sanitize';
import 'angular-messages';
import 'angular-ui-router';
import _ from 'lodash';

import mainModule from './ng-decorators';
import ValidationGeneratorHelper from './helpers/validation-generator-helper';
import DataModel from './classes/data-model';
var DataCollection = require('./classes/data-collection');
import EnvironmentHelper from './helpers/environment-helper';
import ParserHelper from './helpers/parser-helper';
import StateModel from './classes/state-model';
import MockHttp from './classes/mock-http';
import AbstractService from './classes/abstract-service';
import AbstractStubPage from './classes/abstract-stub-page';
import AbstractPage from './classes/abstract-page';
import AbstractComponent from './classes/abstract-component';
import MockHttpFallthrough from './classes/mock-http-fallthrough';
import ResponseLogger from './classes/response-logger';
import ErrorLogger from './classes/error-logger';

/*
	Themes
 */
import AbstractMaterial from './themes/material/abstract-material';
import AbstractBootstrap from './themes/bootstrap/abstract-bootstrap';

import './config/config.dev';
import './config/config.prototype';
import './config/config.test';
import './config/config.prod';
import './config/config';


import './components/components';
import './directives/directives';
import './factories/factories';

const ENV_MODES = ["production", "development", "qa", "localhost", "prototype", "ci"];

class CoreLoader {
	constructor(args) {

		if (!args.config) {
			throw new Error("You must pass the scaffi-ui config in the library initialize function args");
		}
		if(!_.isObject(args.config)) {
			throw new Error("You must pass an object in the config args to initialize scaffi-ui");
		}

		if(!_.has(args, "theme")) {
			throw new Error("You must pass a theme args that extends AbstractTheme. You did not do that. Bad person");
		}

		this.theme = args.theme;


		if(args.private && (!_.isObject(args.private) || !_.isObject(args.private.config))) {
			throw new Error("You're providing a private config which is not an object structure. Bad Human");
		}

		this.config = args.config;

		if(args.private) {
			this.mergeConfigs(args.private);
		}

		if(!this.config.config.environment){
			throw new Error("config.environment is not provided. Scaffi doesn't know to do prototype or not.");
		}

		if(!this.config.config.platform){
			throw new Error("config.platform is not provided. Scaffi doesn't know if this is web or not.");
		}

		if(ENV_MODES.indexOf(this.config.config.environment) === -1) {
			throw new Error("Invalid environment supplied: " + this.config.config.environment + ". Expect one of the following: " + ENV_MODES.join(", ") );
		}




	}
	initializeTheme(appModule){
		this.theme = new this.theme({
			appModule: appModule
		})
	}
	mergeConfigs(privateConfig){
		if(!this.config.config) {
			this.config.config = {};
		}
		_.forEach(privateConfig.config, (item, name)=>{
			this.config.config[name] = item;
		});
	}
	getConfigProperty(name){
		if(_.has(this.config.config, name)) {
			return this.config.config[name];
		}
		return null;
	}
	getConfig(){
		return this.config;
	}
	getEnvironment(){
		return this.getConfigProperty("environment");
	}
	getPlatform(){
		return this.getConfigProperty("platform");
	}
	

}
var coreLoader, initialized;
var returns = {
	initialize(args) {
		coreLoader = new CoreLoader(args);
		
		var requires = [
			// angular modules
			'ngAnimate',
			'ngMessages',
			'ngSanitize',
			
			// 3rd party modules
			'ui.router',
		];
		
		angular.element(document).ready(function() {
			angular.bootstrap(document, [mainModule.name], {
				//strictDi: true
			});
		});
		
		mainModule.requires = mainModule.requires.concat(requires);

		mainModule.config(function($provide) {
			$provide.decorator("$exceptionHandler", function($delegate) {
				return function(exception, cause) {

					ErrorLogger.fireError("ui",exception);
					$delegate(exception, cause);


				};
			});
		});
		
		/*
			Adding for cookie capabilities enabled since we have it defaulted on server to work
		 */
		mainModule.config(($httpProvider) => {
			$httpProvider.defaults.withCredentials = true;
			//rest of route code
		});

		/*
			This disables caching on IE11 if you don't have the console opened
			Was running into this when we had a list pagination page without
			any GET params 
		 */
		mainModule.config( ($httpProvider)=>{
			if(!$httpProvider.defaults.headers.get) {
				$httpProvider.defaults.headers.get = {};
			}

			$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
			$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
		});

		initialized = true;

		coreLoader.initializeTheme(mainModule);

		return mainModule;
		
	},
	config:{
		_isLoaded(){
			return initialized ? true : false;
		},
		_throwLoadError(){
			if(!this._isLoaded()) {
				throw new Error("Scaffi Core has not been loaded yet to be able to reference any of the config functions.");
			}
		},
		getLocalhostAddress(){
			this._throwLoadError();
			return "localhost:" + coreLoader.getConfigProperty("uiLocalhostPort");
		},
		getIdPropertyName(){
			this._throwLoadError();
			return coreLoader.getConfigProperty("idName");
		},
		getParentIdName(parentName){
			this._throwLoadError();
			/*
				TODO this needs to be transformed
			 */
			return parentName + coreLoader.getConfigProperty("idName");
		},
		getVersion(){
			this._throwLoadError();
			return coreLoader.getConfigProperty("version") || "???";
		},
		getApiBase(){
			this._throwLoadError();
			var url = coreLoader.getConfigProperty("apiRoute");

			var base = coreLoader.getConfigProperty("domain");
			if(!base) {
				console.log("!!!No domain provided in ui config. Relying on current domain as domain to send!!!");
				return url;
			}
			
			if(!_.startsWith(base, "http")) {
				throw new Error("domain must either start with http or https");
			}

			return base + url;

		},
		isProductionMode(){
			return coreLoader.getEnvironment() === "production";
		},
		isDevelopmentMode(){
			return coreLoader.getEnvironment() === "development";
		},
		isQaMode(){
			return coreLoader.getEnvironment() === "qa";
		},
		isLocalhostMode(){
			return coreLoader.getEnvironment() === "localhost";
		},
		isPrototypeMode(){
			return coreLoader.getEnvironment() === "prototype";
		},
		isCiMode(){
			return coreLoader.getEnvironment() === "ci";
		},
		getEnvironment(){
			return coreLoader.getEnvironment();
		},
		getPlatform(){
			return coreLoader.getPlatform();
		},
		isWebPlatform(){
			return coreLoader.getPlatform() === "web";
		},
		isIosPlatform(){
			return coreLoader.getPlatform() === "ios";
		},
		isAndroidPlatform(){
			return coreLoader.getPlatform() === "android";
		},
		isMobilePlatform(){
			return coreLoader.getPlatform() === "ios" || coreLoader.getPlatform() === "android";
		}
	},
	transformColumnName(name){
	
	}

};

export default returns;
import {Component, View, RouteConfig, Inject, Run, Config, Service, Filter, Directive, Factory} from './ng-decorators';
export {ValidationGeneratorHelper, DataModel, DataCollection, EnvironmentHelper,
	ParserHelper, StateModel, MockHttp, AbstractService, AbstractStubPage,
	MockHttpFallthrough, AbstractComponent,AbstractPage, ErrorLogger, ResponseLogger,
	Component, View, RouteConfig, Inject, Run, Config, Service, Filter, Directive, Factory,
	AbstractMaterial, AbstractBootstrap
};