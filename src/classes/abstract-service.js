'use strict';

import moment from 'moment';
import _ from 'lodash';
import ParserHelper from '../helpers/parser-helper';

import ScaffiCore from '../index.js';
import {Inject} from '../ng-decorators';
var ID_PROP, API_BASE

//start-non-standard
@Inject('$http', '$state', '$rootScope', '$injector')
//end-non-standard
class AbstractService {
    constructor($http, $state, $rootScope, $injector) {
        this.$http = $http;
        this.route = this.getApiRouteName();
        this.$state = $state;
        this.$rootScope = $rootScope;

        this.stateStore = $injector.get("stateStore");
        this.$injector = $injector;

        ID_PROP = ScaffiCore.config.getIdPropertyName();
        API_BASE = ScaffiCore.config.getApiBase();
        
    }
    getApiRouteName(){
        throw new Error(`This service needs a function that returns the api route name`);
    }
    getPropertyName(){
        throw new Error(`This service needs a function that returns the property name that can be found in a json structure`);
    }

    getService(name) {
        if(!_.endsWith(name, "Service")) {
            name = name + "Service";
        }
        if(this.$injector.has(name)){
            return this.$injector.get(name);
        }
        return null;
    }
    getBaseUrl(){
        return API_BASE + `${this.route}`;
    }
    call(url){
        var that = this;
        return this.$http.get(url).then((response)=>{
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                ParserHelper.convertToApp(response.data); 
                return response.data;
            }
            return that.$rootScope.showResourceError(response);
        }).catch((response) => {
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showResourceError(response);
        });
    }
    /*
        This is a GET but won't fail the whole page if it gets a 404
     */
    resource(id) {
        var that = this;
        var url =  this.getBaseUrl();
        if(id) {
            url += `/${id}`;
        }
        return this.$http.get(url).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                ParserHelper.convertToApp(response.data);

                return this.stateStore.registerRequest(this, url, response.data);

                // if(id) {
                //     return new DataModel(that.route, response.data);
                // } else {
                //     return new DataCollection(that.route, response.data);
                // }
            }
            return that.$rootScope.showResourceError(response);
        }).catch((response) => {
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showResourceError(response);
        });
    }
    get(id) {
        var that = this;
        var url =  this.getBaseUrl();
        if(id) {
            url += `/${id}`;
        }
        return this.$http.get(url).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                ParserHelper.convertToApp(response.data);

                var returnData;
                return this.stateStore.registerRequest(this, url, response.data);
                
                // if(id) {
                //     returnData = new DataModel(that.route, response.data);
                // } else {
                //     returnData = new DataCollection(that.route, response.data);
                // }

                return returnData;

            }
            if(response && response.status == 404) {
                this.$state.go("404")
            }
            return that.$rootScope.showServerError(response);
        }).catch((response) => {
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }

    list(params) {
        var that = this;

        var allowedParamNames = ["filter", "query", "offset", "count", "sorting", "page", "limit"];


        /*
            Break any reference with UI
         */

        params = angular.copy(params);

        _.each(params, function(value, name){
           if(allowedParamNames.indexOf(name) === -1) {
               throw new Error("You're trying to pass an unknown param to getList: " + name +". Check the docs for what you're allowed to send via the front end.");
           }
            /*
                Need to get rid of any filter values that are set as null because that messes up things 
             */
           if(name == "filter") {
               var filters = {};
               _.each(value, (value, name)=>{
                  if(value !== null) {
                      filters[name] = value;
                  } 
               });
               params.filter = filters;
           }


        });

        if(_.has(params, "limit")) {
            params.count = params.limit;
        }

        if(_.has(params, "page")) {
            if(!_.has(params, "count") && !_.has(params, "limit")) {
                throw new Error("You're trying to filter by page but haven't declared a limit or count");
            }
            
            var page = ParserHelper.convertToNumber(params.page);
            if(page === 0) {
                page = 1;
            }
            
            params.offset = (page * params.count) - params.count;
            
            
        }
        
        ParserHelper.convertToDateStrings(params);
        var url = this.getBaseUrl();
        return this.$http.get(url, {params: params}).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
                ParserHelper.convertToApp(response.data);
                response.params = params;
                return this.stateStore.registerRequest(this, url, response.data);

            }
            that.$rootScope.showResourceError(response);

            var data = {
                inlineCount: 0,
                results: []

            };
            return this.stateStore.registerRequest(this, url, data);

        }).catch((response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showResourceError(response);
        });
    }

    // This will POST or PUT depending if there's an Id
    save(resource) {
        if(_.has(resource, "_export")) {
            resource = resource._export();
        }
        if(_.has(resource, ID_PROP)) {
            return this.put(resource);
        } else {
            return this.post(resource);
        }

    }
    post(newResource, opts) {

        var that = this;
        newResource = angular.copy(newResource);
        ParserHelper.convertToDB(newResource);

        return this.$http.post(API_BASE + `${this.route}`, newResource).then( (response)=> {

            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {

                if(!opts || !opts.silent) {
                    that.$rootScope.showSuccessToast(this._getCreatedToastMessage(response));
                }
                return response.data;
            }
            return that.$rootScope.showServerError(response);
        }).catch( (response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }
    
    put(updatedResource, opts) {
        var that = this;
        updatedResource = angular.copy(updatedResource);
        ParserHelper.convertToDB(updatedResource);

        return this.$http.put(API_BASE+`${this.route}/${updatedResource[ID_PROP]}`, updatedResource).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
	            that.$rootScope.showSuccessToast(`Record #${updatedResource[ID_PROP]} successfully updated!`);
                return response.data;
            }
            return that.$rootScope.showServerError(response);
        }).catch( (response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }

    delete(id) {
        var that = this;
        return this.$http.delete( API_BASE+ `${this.route}/${id}`).then( (response)=> {
            that.sendToTestUIHarnessResponse(response);
            if(that.isSuccess(response)) {
	            that.$rootScope.showSuccessToast(`Record #${id} successfully deleted!`);
                return response.data;
            }
            return that.$rootScope.showServerError(response);
        }).catch( (response)=>{
            that.sendToTestUIHarnessResponse(response);
            return that.$rootScope.showServerError(response);
        });
    }
    getRoute(){
        return this.route;
    }
    sendToTestUIHarnessResponse(response){
        if(_.has(this.$rootScope, "addTestUIHarnessResponse") && _.isFunction(this.$rootScope["addTestUIHarnessResponse"])) {
            this.$rootScope["addTestUIHarnessResponse"](response);
        }
    }
   
    isSuccess(response) {
        return response && response.status > 199 && response.status < 300;
    }
    
    _getCreatedToastMessage(response) {
        var msg = "Record successfully created!";
        if(_.isObject(response) && _.has(response, ID_PROP)) {
            msg = `Record ${response[ID_PROP]} successfully created!`;
        } else if(_.isNumber(response)) {
            msg = `Record ${response} successfully created!`;
        }
        
        return msg;
    }

    /*
        Event handler functions
     */
    configDataModel(){
        return true;
    }
    configDataCollection(){
        return true;
    }

}

export default AbstractService;
