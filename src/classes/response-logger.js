import _ from 'lodash';
import ScaffiCore from '../index.js';

class ResponseLogger {
	constructor(){
		this.listeners = [];
		this.errorListeners = [];
	}
	/*
		type - get, resource, list, post, put, delete
	 */
	fire(type, response) {
		var status = response && response.status ? response.status : 500;
		_.each(this.listeners, (event)=>{
			if(_.isFunction(event)){
				event({type, response, status});
			}
		}, this);

		if(response && response.status == -1 && ScaffiCore.config.isPrototypeMode()){
			return response;
		}
		
		if(!this.isSuccess(response)) {
			_.each(this.errorListeners, (event)=> {
				if(_.isFunction(event)){
					event({type, response, status});
				}
			});
		}

	}
	isSuccess(response) {
		return response && response.status > 199 && response.status < 300;
	}
	onErrorResponse(event){
		this.errorListeners.push(event);
	}
	onResponse(event){
		this.listeners.push(event);
	}
}

export default new ResponseLogger();