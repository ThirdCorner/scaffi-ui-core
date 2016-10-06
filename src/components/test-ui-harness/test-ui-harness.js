'use strict';
import _ from 'lodash';
import {RouteConfig, Component, View, Inject} from '../../ng-decorators'; // jshint unused: false
import ResponseLogger from '../../classes/response-logger';
import ScaffiCore from '../../index.js';
var API_BASE;
/*
    !!! If you do something like this with the view, make it a directive instead.
     scope: false,
     transclude: true,
     bindToController: true,
     replace: true
*/

//start-non-standard
@Component({
    selector: 'test-ui-harness',
})
@View({
    template: template,
    // If you need certain variables passed in, uncomment scope here
    //scope: {}
})
//end-non-standard


class TestUiHarness {
    constructor($rootScope){
        var that = this;
	    API_BASE = ScaffiCore.config.getApiBase();
        this.responses = null;
	    this.isTesting = false;
	    if(ScaffiCore.config.isCliMode()) {
		    this.isTesting = true;
	    }
	    ResponseLogger.onResponse((event)=>{
		    that.addResponse(event);    
	    });
	    
    }
    addResponse(response){
        if(this.isTesting && this.watching) {
            var setResp = {};
            if(response.config) {
                setResp.type = response.config.method;
                setResp.url = _.isString(response.config.url) ? response.config.url.substr(API_BASE.length) : "";

            }
            if(response.status < 200 || response.status > 299) {
                setResp.error = true;

            }
            if(response.data) {
                setResp.data = response.data;
                try {
                    setResp.data = JSON.stringify(response.data);
                } catch (e) {
                }
            }
            this.responses.push(setResp);
        }
	    if(this.isTesting) {
		    if(response.status < 200 || response.status > 299) {
			    var message = `Server Error. StatusCode: ${response.status}`;
			    if(response.status === -1) {
				    message += ". Is the backend server enabled?";
			    }
			    throw new Error(message);

		    }
	    }
    }

    startWatching() {
        this.responses = [];
        this.watching = true;
    }
    stopWatching(){
        this.watching = false;
    }

}

export default TestUiHarness;


/* .GULP-IMPORTS-START */ import template from './test-ui-harness.html!text'; /* .GULP-IMPORTS-END */
