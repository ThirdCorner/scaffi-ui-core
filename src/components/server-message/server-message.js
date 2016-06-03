'use strict';

import template from './server-message.html!text';

import {RouteConfig, Service, Component, View, Inject} from '../../ng-decorators'; // jshint unused: false
import ErrorLogging from '../../classes/error-logging';
import _ from "lodash";

/*
    !!! If you do something like this with the view, make it a directive instead.
     scope: false,
     transclude: true,
     bindToController: true,
     replace: true
*/
//start-non-standard
@Component({
    selector: 'server-message',
})
@View({
    template: template,
    // If you need certain variables passed in, uncomment scope here
    //scope: {}
})
//end-non-standard


class ServerError {
    constructor($rootScope, $state, $mdToast, $mdSidenav){
        this.$state = $state;
	    this.$mdToast = $mdToast;
        this.$mdSidenav = $mdSidenav;

        var that = this;
        $rootScope.showResourceError = (response)=>{
            if(response && response.status == -1 && $rootScope.getEnvironment() == "prototype") {
                return response;
            }
            return that.showInfo(response);
        };

	    $rootScope.showSuccessToast = (message) =>{
		    return that.showSuccessToast(message);
	    };
        $rootScope.showErrorToast = (message) =>{
            return that.showErrorToast(message);
        };
        $rootScope.hideServerPopup = ()=>{
            return that.hidePopup();
        };
        
        ErrorLogging.onError((errors)=>{
            that.showPopup(errors);
        });
    }
    dismiss(){
        this.hidePopup();
    }
	showSuccessToast(message) {
		this.$mdToast.show(
			this.$mdToast.simple()
				.textContent(message)
				.theme("success-toast")
				.position("bottom right")
				.hideDelay(3000)
		);
	}
    showErrorToast(message) {
        this.$mdToast.show(
            this.$mdToast.simple()
                .textContent(message)
                .theme("error-toast")
                .position("bottom right")
                .hideDelay(7000)
        );
    }
    showInfo(response){
        //console.log("=================== INFO =================");
        //console.log(response);
        //console.log("==========================================");

        if(response && response.status != 404) {
            this.showErrorPopup(response);
        }
    }
    showPopup(response){
        // if(response && response.status == 404) {
        //     this.$state.go("404");
        //     return;
        // }

        this.showErrorPopup(errors);
    }
    showErrorPopup(errors){


        this.errors = errors;
        if(!this.showing) {
            this.$mdSidenav('server-error').toggle();
            this.showing = true;
        }

    }
    hidePopup(){
        var that = this;
        this.$mdSidenav('server-error').close()
            .then(function () {
                that.errors = null;
                ErrorLogging.clearErrors();
                //that.$state.go(that.$state.current, {}, {reload: true});
            })

    }

}

export default ServerError;

