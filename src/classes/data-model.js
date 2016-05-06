'use strict';

import _ from 'lodash';
import ScaffiCore from '../index';
var ID_PROP;

var DataCollection = require('./data-collection');
import EventListener from './event-listener';


class DataModel {
	constructor(Service, data, stateModel) {
		ID_PROP = ScaffiCore.config.getIdPropertyName();
		
		this._service = Service;
		this._namespace = this._service.getPropertyName();
		
		this._stateModel = stateModel;
		
		if(_.isObject(data)) {
			_.each(data, (value, key) =>{
				var setVar = value;

				setVar = this.convertToDataCollection(key, setVar);
				
				this[key] = setVar;
				
			}, this);
			
			this._setSocketListener();
		}


		var that = this;
		this._events = new EventListener({
			bubble:function(event){
				that._events.bubble.apply(that._events, arguments);
			},
			hasStatus:(search)=>{

			},
			get:(prop, ifFound)=>{
				if(_.has(that, prop) && that[prop]) {
					ifFound(that[prop]);
				}
			},
			set:(prop, value)=>{

			}
		});
		
		
	}
	_on(event, callerFn) {
		if(arguments.length == 2) {
			this._events.on(event, callerFn);
		} else {
			this._events.on(event);
		}
	}

	onBubble(eventFn){
		this._events.onBubble(eventFn);
	}
	onCustom(event, fn){
		this._events.on(event, fn);
	}
	onStateChange(statusFn) {
		this._events.on("state", statusFn);
	}
	onUpdate(updateFn){
		this._events.on("update", updateFn);
	}
	onCreate(createFn){
		this._events.on("create", createFn);
	}
	onDelete(deleteFn){
		this._events.on("delete", deleteFn);
	}
	updateData(event, data){
		if(!_.isObject(data)){
			return false;
		}

		_.each(data, (value, key)=>{
			/*
				Fill in any data not there. For instance, data
				from the server will have an array, while a newly created model will not.
				Nor will it have timestamps.
				
			 */
			if(!_.has(this, key)) {
				this[key] = value;
			} else {
				value = this[key];
			}
			/*
				If the data structure came from the server, it needs to be converted into a rest collection
			 */
			this[key] = value = this.convertToDataCollection(key, value);

			if(this._isDataCollection(value) && _.has(data, key)){
				value.updateData(event, data[key]);
			}
		}, this);
		
	}
	_isDataCollection(value) {
		return _.isArray(value) && _.has(value, "_inlineCount")
	}
	convertToDataCollection(key, value) {
		if(_.isArray(value) && !this._isDataCollection(value)) {
			var childService = this._service.getService(key);
			if(childService) {
				var that = this;
				value = new DataCollection();
				value.init(childService, value, this._stateModel);
				this._stateModel.setBaseLevel(this._service.getPropertyName() + "#" + this[ID_PROP]);
				value._setParentLinkFunction((model)=>{
					model[that._namespace + "Id"] = that[ID_PROP];
				});
				
				value.onBubble(function(){
					that._events.triggerBubble.apply(that._events, arguments);
				});
				
				if(that._service) {
					that._service.configDataCollection(value);
				}
			}

		}

		return value;
	}
	_setSocketListener(){
		if(!this[ID_PROP]) {
			return;
		}

		var that = this;
		this._stateModel.getSocket().on( "update:" + this._service.getPropertyName() + "#" + this[ID_PROP], function(struct){
			if(_.isObject(struct) && !_.isArray(struct)){
				_.each(struct, (value,name)=>{
					that[name] = value;
				});
				that._events.trigger("update", struct);
			}
		});
		this._stateModel.getSocket().on("delete:" + this._service.getPropertyName() + "#" + this[ID_PROP], function(){
			that._events.trigger("delete");

		});


		this._stateModel.getSocket().on("state:" + this._service.getPropertyName() + "#" + this[ID_PROP], function(struct){
			that.setState(struct.state);
		});
		
	}
	hasState(checkString){
		if(!this._states) {
			return false;
		}
		return this._states.indexOf(checkString) !== -1;
	}
	setState(changedState){

		if(!this._service.states) {
			return false;
		}

		if(!this._states) {
			this._states = [];
		}
		var toSet = [];
		_.each(this._service.states, (keys, name)=>{
			if(_.isArray(keys) && keys.indexOf(changedState) !== -1) {
				toSet.push(name);
			}
		}, this);

		if(toSet.length) {
			var removeStates = [];
			_.each(toSet, (stateCategory)=>{
				_.each(this._states, (currentState)=>{
					if(_.startsWith(currentState, stateCategory)) {
						removeStates.push(currentState);
					}
				}, this);
			}, this);

			if(removeStates.length) {
				_.each(removeStates, (name)=>{
					this._states.splice(this._states.indexOf(name), 1);
				}, this);
			}

			_.each(toSet, (setCategory)=>{
				this._states.push(setCategory + ":" + changedState);
				this._events.trigger("state", setCategory + ":" + changedState);
			}, this);


		}

	}
	_getBaseNamespace(){
		return this._baseNamespace;
	}
	_hasBaseNamespace(){
		return this._baseNamespace ? true : false;
	}
	_setBaseNamespace(baseNamespace) {
		this._baseNamespace = baseNamespace;
	}
	setId(id) {
		if(typeof id == "string") {
			id = parseInt(id, 10);
		}
		this[ID_PROP] = id;
		
		this._setSocketListener();
		
	}
	save(){
		var that = this;
		return this._service.save(this.export()).then(data=>{
			if(data[ID_PROP]) {
				that.setId(data[ID_PROP]);
				that._events.trigger("create", {[ID_PROP]: data[ID_PROP]})
			}
		});
	}
	pushChanges(name){
		var sendStructure = {};
		sendStructure[ID_PROP] = this[ID_PROP];
		sendStructure[name] = this[name];
		return this._service.save(sendStructure);
		//console.log("CHANGING " , name, ": ", this[name]);
	}
	delete(){
		if(this[ID_PROP]) {
			return this._service.delete(this[ID_PROP]);
		}
		this._events.trigger("delete")
	}
	getNamespace() {
		return this._namespace;
	}
	filter() {
		throw new Error("There's no use case to filter items on a DataModel. Did you expect this to be a DataCollection? Check your code, boyo.");
	}
	export(data){

		var returnObj = {};

		var parseData = this;
		if(data) {
			parseData = data;
		}

		_.each(parseData, (value,key) =>{
			if(_.isFunction(value)) {
				return;
			}
			switch(true) {
				case value instanceof DataCollection:
					//returnObj[key] = value._export();
					break;
				case value instanceof DataModel:
					returnObj[key] = value.export();
					break;
				case _.isArray(value):
					// var returnArray = [];
					// _.each(value, (item)=>{
					// 	returnArray.push(this._export(item));
					// }, this);
					//returnObj[key] = returnArray;
					break;
				default:
					//console.log(parseData, key, _.isArray(value));
					if(key.indexOf("_") !== 0) {
						returnObj[key] = value;
					}

			}

		}, this);

		return returnObj;
	}
}


export default DataModel;