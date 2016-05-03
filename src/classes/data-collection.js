'use strict';

import DataModel from './data-model';
import EventListener from './event-listener';
import ScaffiCore from '../index';
var ID_PROP;
import _ from 'lodash';

class DataCollection extends Array {
	/*
		fireUpdateParent fn that tells first node parent to refresh its data
	 */
	constructor(Service, data, stateModel){
		
		ID_PROP = ScaffiCore.config.getIdPropertyName();
		
		var inlineCount = 0;
		if(data) {
			if(_.has(data, "inlineCount")) {
				inlineCount = data.inlineCount;
			}
			if(_.has(data, "results")) {
				data = data.results;
			}
		}

		if(!_.isArray(data)) {
			data = [];
		}

		super();

		this._service = Service;
		this._stateModel = stateModel;

		if(!stateModel) {
			throw new Error("Rest Collection doesn't have state model")
		}
		this._setSocketConnection();
		
		this._inlineCount = inlineCount;

		_.each(data, (value) =>{
			this.push(value);
		}, this);

		var that = this;
		this._events = new EventListener({
			bubble:()=>{
				that._events.bubble.apply(that._events, arguments);
			},
			hasStatus:(search)=>{

			},
			get:(prop)=>{
				if(_.has(that, prop) && that[prop]) {
					return that[prop];
				}
			},
			set:(prop, value)=>{

			}
		});



		this._parentLink = null;
		
	}
	onCustom(event, fn){
		this._events.on(event, fn);
	}
	onBubble(bubbleFn){
		this._events.onBubble(bubbleFn);	
	}
	onUpdate(updateFn){
		this._events.on("update", updateFn);
	}
	onCreate(createFn){
		this._events.on("create", createFn);
	}
	onDelete(deleteFn) {
		this._events.on("delete", deleteFn);
	}

	updateData(eventName, fetchedData) {
		if(_.has(fetchedData, "results")) {
			fetchedData = fetchedData.results;
		}

		if(!_.isArray(fetchedData)){
			console.log(fetchedData);
			throw new Error("Trying to update collection with a non-array");
		}

		var currentIds = [];
		this.forEach((item, index, array)=>{
			currentIds.push(item[ID_PROP]);
		});

		var needToAdd = _.filter(fetchedData, (checkModel)=>{
			return currentIds.indexOf(checkModel[ID_PROP]) === -1;
		});

		this.forEach((item, index, array)=>{
			var found = _.find(fetchedData, (check)=>{
				return check[ID_PROP] === item[ID_PROP];
			});

			if(found) {
				item.updateData(eventName, found);
			}

		});

		_.each(needToAdd, (model)=>{
			this.push(model);
		}, this);



	}
	_setSocketConnection() {
		// add destroy listeners

		var listener = "create:" + this._service.getPropertyName();
		if(this._hasBaseNamespace()){
			listener += this._getBaseNamespace();
		}

		var that = this;
		this._stateModel.getSocket().on(listener, that._stateModel.getUpdateCallback(listener));


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
	/*
	 This lets the collection request a parent link if it has one for when we push new models
	 */
	_setParentLinkFunction(fn){
		this._parentLink = fn;
	}
	filter(filterEvent) {
		if(filterEvent) {
			this._filterEvent = filterEvent;
		}
		
		if(this._filterEvent) {
			this.filtered = _.filter(this, this._filterEvent);
		} 
	}
	push(data) {
		if(!_.isObject(data)){
			data = {};
		}
		
		var  model = new DataModel(this._service, data, this._stateModel);


		if(this._hasBaseNamespace()) {
			model._setBaseNamespace(this._getBaseNamespace());
		}
		
		if(_.isFunction(this._parentLink)){
			this._parentLink(model);
		}

		var that = this;
		model.onDelete(()=>{
			that.removeItem(model);
		});
		
		/*
			Babel won't convert this correctly if we change from function(){} to ()=>{}
			We'll lose the first argument if we do that for some reason.
		 */
		var modelFn = function(){
			var sendArgs = [];
			_.each(arguments, (value, key)=>{
				sendArgs.push(value);
				
			});
			
			that._events.trigger.apply(that._events, sendArgs);
		};
		model.onUpdate(modelFn);
		model.onCreate(modelFn);
		model.onDelete(modelFn);
		model.onStateChange(modelFn);
		model.onBubble(function(){
			var sendArgs = [];
			_.each(arguments, (value, key)=>{
				sendArgs.push(value);
		
			});
			that._events.triggerBubble.apply(that._events, sendArgs);
		});

		if(this._service) {
			this._service.configDataModel(model);
		}

		Array.prototype.push.call(this, model);
		return model;
	}
	removeItem(model){
		var foundIndex = null;
		this.forEach((item, index)=>{
			if(item[ID_PROP] == model[ID_PROP]){
				foundIndex = index;
			}
		});
		
		if(!_.isNull(foundIndex) && this.length > foundIndex){
			Array.prototype.splice.call(this, foundIndex, 1);
		}
	}


	_export(){
		if(this.length === 0) {
			return [];
		}

		var data = Array.prototype.slice.call(this);

		_.each(data, (value, key) =>{
			if(value instanceof DataModel) {
				data[key] = value.export();
			}
		}, this);

		return data;
	}
}

export default DataCollection;