'use strict';

import AbstractTest from './abstract-test';

import rp from 'request-promise';
import _ from 'lodash';

import ScaffiCore from '../../index';

/*
    This handles parsing through opts shared through all testing classes.
 */

class AbstractApiTest extends AbstractTest {
    /*
     {
         allowedRest: ['GET', 'PUT'] etc GET, PUT, POST, DELETE
            If get is not allowed, PUT and POST assume success based on 200, rather than fetching list and making
            sure values got set.
         route: 'suppliers' (OPTIONAL)
            (route to call for each test. Will be overriden if a different route is provided in individual test calls, like testPOST
            default:
                GET: 'api/suppliers/1'
                POST: 'api/suppliers'
                PUT: 'api/suppliers/1'
                DELETE: 'api/suppliers/1'
                LIST: 'api/suppliers'
            )
         fixture: {}
               fixture object
         id: # - or id to grab fixture
         debug: true - Well show console logs at certain points

         showResponse: true, will show structures coming back


         ignoreProperties: []
            List of property names to ignore when changing values on PUT calls.
            ['ID', 'SandSupplier.Name']

         routeOpts: { // These are optional if testing via testFixtures. Provide these if you want to override global versions,
                    such as if you want to go to a different route for get than defaults
            GET: {
                route: suppliers/:id
                fixture: {}
            }
            POST: {
                route: suppliers
                fixture: {}
            }
            PUT: {
                route: suppliers/:id
                fixture: {}
                ignoreProperties: [] - See above
            }
            DELETE: {
                route: suppliers/2
            }
            LIST: {
                route: suppliers
            }

            }
        }
        restOpts: ['GET', 'PUT'] etc
     */
    constructor(opts){
        super(opts);
    
        this.ID_PROP = ScaffiCore.config.getIdPropertyName();
        this.API_BASE = ScaffiCore.config.getApiBase();
        
        
        this.opts = {
            allowedRest: ['GET', 'PUT', 'POST', 'DELETE', 'LIST']
        };

        Object.assign(this.opts, opts);

        if(this.opts.route) {
            var route = this.opts.route;
            var routes = {
                GET: {route: route + "/:id"},
                POST: {route: route},
                PUT: {route: route + "/:id"},
                DELETE: {route: route + "/:id"},
                LIST: {route: route}
            };
            if(this.opts.routeOpts){
                var routeOpts = this.opts.routeOpts;
                this.opts.routeOpts = Object.assign(routes, routeOpts);

            } else {
                this.opts.routeOpts = routes;
            }
        }
        this.baseUrl = this.API_BASE;
        this.data = {};
        if(this.opts.fixtures) {
            this.addTest(this._generateFixturesTest(this.opts));
        }

        if(this.opts.showResponse) {
            this.showResponseEnabled = true;
        }
        if(this.opts.debug) {
            this.enableDebugging();
        }
        if(this.opts.revertData) {
            this.revertData = this.opts.revertData;
        }

        this.initialize();
    }

    shouldShowResponse(){
        return this.showResponseEnabled;
    }

    getRoute(methodType){
        if(this.opts.routeOpts && _.has(this.opts.routeOpts, methodType)) {
            return this.opts.routeOpts[methodType].route;
        } else {
            return this.opts.route;
        }

    }
    makeServerUrl(route) {
        return this.baseUrl + route;
    }
    makeServerOpts(RESTType, route) {

        if(!route) {
            this.throwError("You must set an opts.route for this specific test!", route);
        }

        var options = {
            method: RESTType,
            json: true
        };

        options.uri =  this.makeServerUrl(route);

        return options;
    }
    getRESTOptions(RESTType, opts) {
        console.log(opts);
        var mergedOpts = this.copy(this.opts);

        if(opts) {
            Object.assign(mergedOpts, opts);
        }
        if(_.has(this.opts.routeOpts, RESTType)) {
            Object.assign(mergedOpts, this.opts.routeOpts[RESTType]);
        }


        return mergedOpts;
    }
    getFixture(){
        return this.opts.fixture;
    }
    setFixture(fixture){
        this.opts.fixture = fixture;
    }

    fetchData(options) {
        return rp(options);
    }


    _makeRouteOpts(opts, RESTType) {
        opts = copy(opts);
        if (opts.routeOpts && _.has(opts.routeOpts, RESTType)) {
            opts = Object.assign(opts, opts.routeOpts[RESTType]);
        }

        return opts;

    }
    clearDataStore(){
        this.data = {};
    }
    getData(name) {
        return this.data[name] || null;
    }
    setData(name, value) {
        this.data[name] = value;
    }
    _getTestUrl(opts, id) {
        if(!opts.route) {
            this.throwError("You must set an opts.route for this specific test!", opts);
        }
        var url = this.baseUrl + opts.route;
        if(id && url.indexOf(":id") !== -1) {
            url = url.replace(":id", id);
        }
        return url;
    }
    _checkAllowed(RESTOpts) {
        if(!this.opts.allowedRest) {
            return true;
        }
        return this.opts.allowedRest.indexOf(RESTOpts) !== -1;
    }
    allowGET(){
        return this._checkAllowed("GET");
    }
    allowPOST(){
        return this._checkAllowed("POST");
    }
    allowPUT(){
        return this._checkAllowed("PUT");
    }
    allowDELETE(){
        return this._checkAllowed("DELETE");
    }
    allowLIST(){
        return this._checkAllowed("LIST");
    }

}

export default AbstractApiTest;
