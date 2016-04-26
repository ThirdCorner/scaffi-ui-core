'use strict';

import {Factory} from '../../ng-decorators'; // jshint unused: false
import {ParserHelper} from '../../index.js';
/*
TODO need to add a live edit config to scaffi-ui
 */
var LIVE_EDITS = false;
import _ from 'lodash';
//start-non-standard
@Factory({
	factoryName: 'socketIO'
})
//end-non-standard
class SocketIO  {
	constructor($rootScope) {

		if(LIVE_EDITS) {
			var url = window.location.hostname + ":3000";
			this.socket = io.connect(url);

			this.$rootScope = $rootScope;
		}
	}
	on (eventName, callback) {
		if(!LIVE_EDITS) {
			return false;
		}

		var that = this;

		// console.log("ON SOCKET: ", eventName);
		var socket = this.socket;
		socket.on(eventName, function () {
			var args = [];
			_.each(arguments, (value)=>{
				args.push(value);
			});
			
			ParserHelper.convertToApp(args);
			that.$rootScope.$apply(function () {

				callback.apply(socket, args);
			});
		});
	}
	emit (eventName, data, callback) {
		if(!LIVE_EDITS) {
			return false;
		}
		var that = this;
		var socket = this.socket;
		socket.emit(eventName, data, function () {
			var args = arguments;
			that.$rootScope.$apply(function () {
				if (callback) {
					callback.apply(socket, args);
				}
			});
		})
	}
	
	static factory($rootScope) {
		SocketIO.instance = new SocketIO($rootScope);
		return SocketIO.instance;
	}


}

export default SocketIO;
