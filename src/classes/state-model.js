'use strict';


import DataCollection from './data-collection';
import DataModel from './data-model';

import _ from 'lodash';
class StateModel {
	constructor(url, service, data, socketIO) {
		this.url = url;
		this.service = service;
		this.socketIO = socketIO;

		this.parseData(data);
	}

	parseData(data){
		if(!data) {
			return null;
		}
		
		var inlineCount = null;
		/*
			THis means it's a LIST pull
		 */
		if(_.has(data, 'inlineCount')) {
			inlineCount = data.inlineCount;
			data = data.results || [];
		}
		
		if(_.isArray(data)){
			this.data = new DataCollection(this.service, data, this);
			if(inlineCount) {
				this.data.setServerTotal(inlineCount);
			}
			
		} else {
			this.data = new DataModel(this.service, data, this);
		}
		
		
		
	}
	hasBaseLevel(){
		return this.baselevel ? true : false;
	}
	getBaseLevel(){
		return this.baselevel;
	}
	setBaseLevel(baseLevel){
		this.baselevel = baseLevel;
	}
	getUpdateCallback(listener){
		var that = this;
		return ()=>{
			that.service.call(that.url).then( data =>{
				that.data.updateData(listener, data);
			});
		};
	}
	getSocket(){
		return this.socketIO;
	}

	getRest(){
		return this.data;
	}
}

export default StateModel;



