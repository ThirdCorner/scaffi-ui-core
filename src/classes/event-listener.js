'use strict';

import _ from 'lodash';

class EventListener {
	constructor(scope){
		this.listeners = {
			_all: []
		};
		this.scope = scope || {};
	}
	onBubble(eventFn) {
		this.on("_bubble", eventFn);
	}
	bubble(event) {
		if(!event) {
			return false;
		}

		var sendArgs = [];
		_.each(arguments, (value, key)=>{
			sendArgs.push(value);
		});

		sendArgs.unshift("_bubble");

		this.trigger.apply(this, sendArgs);

	}
	on(event, callback) {
		if(arguments.length == 2) {
			if (!this.listeners[event]) {
				this.listeners[event] = [];
			}

			this.listeners[event].push(callback);
		} else if(arguments.length == 1 && _.isFunction(event)) {
			this.listeners['_all'].push(event);
		}
	}
	triggerBubble(){
		var sendArgs = [];
		_.each(arguments, (value, key)=>{
			sendArgs.push(value);
			
		});
		sendArgs.unshift("_bubble");
		this.trigger.apply(this, sendArgs);
	}
	trigger(event) {

		if(!arguments) {
			return false;
		}

		event = arguments[0];
		var trimCount = 0;

		var isBubbling = false;
		if(event == "_bubble") {
			isBubbling = true;
			trimCount = 1;
			event = arguments[1];
		}

		var sendArgs = [];
		_.each(arguments, (value, key)=> {

			if (key > trimCount) {
				sendArgs.push(value);
			}
		});


		if(this.listeners[event]) {
			_.each(this.listeners[event], (eventFn)=> {
				if(eventFn.apply(this.scope, sendArgs) === false){
					/*
					Todo: Add logic to stop the bubble up. Right now it'll just go to the top
					 */
				}
			}, this);

		}

		sendArgs.unshift(event);
		if(this.listeners._all.length) {
			_.each(this.listeners._all, (eventFn)=>{
				eventFn.apply(this.scope, sendArgs);
			}, this);
		}

		if(isBubbling) {
			if(!this.listeners._bubble){
				return false;
			}

			_.each(this.listeners._bubble, (event)=>{
				event.apply(this.scope, sendArgs);
			}, this);
		}
	}
	
}

export default EventListener;