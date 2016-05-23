'use strict';

import angular from "angular";
import 'angular-aria';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';
import 'angular-sanitize';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-loading-bar';
import 'ng-table';
import 'angular-breadcrumb';
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
import AbstractComponent from './classes/abstract-component';
import MockHttpFallthrough from './classes/mock-http-fallthrough';

import './config/config.dev';
import './config/config.prototype';
import './config/config.test';
import './config/config.prod';
import './config/config';


import './components/components';
import './directives/directives';
import './factories/factories';

class CoreLoader {
	constructor(args) {
		if (!args.config) {
			throw new Error("You must pass the scaffi-ui config in the config property args");
		}
		if(!_.isObject(args.config)) {
			throw new Error("You must pass an object in the config args to initialize scaffi-ui");
		}

		if(!args.ENV){
			throw new Error("ENV args var has not been set. Scaffi doesn't know to do prototype or not.");
		}
		this.ENV = args.ENV;
		this.config = args.config;

		if(!this.ENV){
			throw new Error("ENV global var has not been set. Scaffi doesn't know to do prototype or not.");
		}

		console.log("CORE LOADED");


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
		return this.ENV;
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
			'ngTable',
			'angular-loading-bar',
			'ncy-angular-breadcrumb'
		];
		
		angular.element(document).ready(function() {
			angular.bootstrap(document, [mainModule.name], {
				//strictDi: true
			});
		});
		
		mainModule.requires = mainModule.requires.concat(requires);
		initialized = true;
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
		getApiBase(){
			this._throwLoadError();
			return coreLoader.getConfigProperty("apiRoute");
		},
		getEnvironment(){
			return coreLoader.getEnvironment();
		}
	},
	transformColumnName(name){
	
	}

};

export default returns;
import {Component, View, RouteConfig, Inject, Run, Config, Service, Filter, Directive, Factory} from './ng-decorators';
export {ValidationGeneratorHelper, DataModel, DataCollection, EnvironmentHelper,
	ParserHelper, StateModel, MockHttp, AbstractService, AbstractStubPage,
	MockHttpFallthrough, AbstractComponent,
	Component, View, RouteConfig, Inject, Run, Config, Service, Filter, Directive, Factory};