'use strict';

import _ from 'lodash';
import ScaffiCore from '../index';
var ID_PROP;

import ParserHelper from '../helpers/parser-helper';

const HEADER_API_VERSION = 'application/json;version=1';

var keptID = Math.floor(Date.now() / 1000);

function parseURL(url) {
    if(url.indexOf("?") === -1) return {};
    var params = url.substr(url.indexOf("?") + 1).split("&");
    //var params = JSON.parse('{"' + decodeURI(url.substr(url.indexOf("?")+1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    var results = [];
    _.each(params, function(part){
        var item = part.split("=");
        try {
            var str = decodeURIComponent(item[1]).replace(/\+/g, " ");
            results[item[0]] = JSON.parse(str);
        }catch(e){}

    });
    return results;
}
function filter(url, obj) {
    var params = parseURL(url);

    obj = angular.copy(obj);
    /*
     SORTING
     */
    if (params.sorting && _.isObject(params.sorting)) {
        var col = [], order = [];
        _.each(params.sorting, function (value, name) {
            col.push(name);
            order.push(value);
        });

        if (col.length) {
            obj = _.sortByOrder(obj, col, order);
        }
    }

    var setFilter = function(filters, name, value) {
        var reservedFilters = ['sorting', 'count', 'page'];
        if(reservedFilters.indexOf(name) === -1) {
            filters[name] = value;
            return true;
        }


        return false;
    };

    /*
        Don't need this because all filter columns are under a 'filter' obj property
     */
    // var parseFilters = (parseFilter) => {
    //     var foundFilter = false;
    //     var filters = {};
    //     _.each(parseFilter, function (filter, name) {
    //         if(_.isObject(filter)) {
    //             var returnedFilters = parseFilters(filter);
    //             if(returnedFilters) {
    //                 filters[name] = returnedFilters;
    //                 foundFilter = true;
    //             }
    //         } else {
    //             if (_.isString(filter) && filter.length == 0) {
    //                 filter = null;
    //             }
    //
    //             if (filter && filter != null && (filter.length > 0 || _.isNumber(filter))) {
    //
    //                 filters[name] = filter;
    //                 foundFilter = true;
    //
    //             }
    //         }
    //     }, this);
    //     if(!foundFilter) {
    //         filters = null;
    //     }
    //
    //     return filters;
    //
    // };
    /*
     FILTERING
     */
    var shouldFilterRecord = function(record, filters) {
        var foundRecord = true;
        _.each(filters, function(name, value){
            if(!_.has(record, name)) {
                foundRecord = false;
                return;
            }
            switch(true) {
                case _.isNumber(value):
                    if(record[name] != value) {
                        foundRecord = false;
                    }
                    break;
                case _.isString(value):
                    if(!_.startsWith(record[name], value)){
                        foundRecord = false;
                    }
                    break;
                case _.isObject(value):
                    console.log("Object nested filtering on prototype mode is not yet supported. Obviously this needs to be eventually.");
                    foundRecord = false;
                    break;

                default:
                    console.log("Not sure how to parse the following to filter it", name, value);
                    foundRecord = false;
            }
        });

        return foundRecord;
    };

    if (params.filter && _.isObject(params.filter)) {
        var filters = params.filter;
        obj = _.find(obj, function(record) {
            return shouldFilterRecord(record, filters);
        });
    }
    var totalCount = obj.length;
    /*
     COUNT
     */

    if (params.count && _.isNumber(params.count) && params.count != 1) {
        var start = 0;
        var end = params.count;
        if(params.page && _.isNumber(params.page)) {
            start = params.page * params.count - params.count;
            end = start + params.count;
        }
        obj = _.slice(obj, start, end);

    }




    return {inlineCount: totalCount, results: obj};
}
/*
    This is to ensure that nested objects get IDs. For instance, if you're in a page
    and you're adding a "foreign key group", this will add the ids to that foreign group
    as if it were added via the server database.
 */
function addId(data) {

    if(ParserHelper.isObject(data) && !_.has(data, ID_PROP)) {
        keptID++;
        data[ID_PROP] = keptID;
    }
    if(ParserHelper.isContainer(data)) {
        _.each(data, function(value, key){
            if(ParserHelper.isContainer(value)){
                data[key] = addId(value);
            }
        }, this);
    }

    return data;
}


class MockHttp {

    /*
        OVERRIDES : ["LIST": (method, url, data, headers) => {}] means it won't call specific default routes so you can override
     */
    init($httpBackend, route, fixture, overrides){
        if(ScaffiCore.config.getEnvironment() != "prototype") {
            return false;
        }
        ID_PROP = ScaffiCore.config.getIdPropertyName();
        overrides = overrides || {};

        //const patternBase = new RegExp(`\/api\/${route}`);
        var patternBase = new RegExp(`\/api\/${route}`),
        patternGet = new RegExp(`\/api\/${route}\/\\d+`),
        patternId = new RegExp(`\/api\/${route}\/(\\d+)`);

        var ignoreParams = ["GET", "LIST"];

        function callSet(headers, statusCode, data) {
            headers['Content-Type'] = HEADER_API_VERSION;

            if(data) {
                return [statusCode, data];
            } else {
                return [statusCode];
            }


        }
        function callCustom(fn, method, url, data, headers) {
            var returnData = fn(method, url, data, headers);
            if(returnData.length == 1) {
                return callSet(headers, returnData[0]);
            } else if(returnData.length == 2) {
                return callSet(headers, returnData[0], returnData[1]);
            }
        }


        if(fixture.COLLECTION) {


                $httpBackend.whenGET(patternGet)
                    .respond((method, url, data, headers) => {
                        if(overrides.GET) {

                            return callCustom(overrides.GET, method, url, data, headers);


                        } else {


                            var id = parseInt(url.match(patternId)[1], 10);

                            var found = _.find(fixture.COLLECTION, function (item) {
                                return _.has(item, ID_PROP) && item[ID_PROP] == id;
                            });
                            if (found) {
                                return callSet(headers, 200, found);
                            }

                            return callSet(headers, 404);


                        }

                    });


                $httpBackend.whenGET(patternBase)
                    .respond((method, url, data, headers) => {
                        if(overrides.LIST) {

                            return callCustom(overrides.LIST, method, url, data, headers);


                        } else {
                            var returnObj = filter(url, fixture.COLLECTION);

                            return callSet(headers, 200, returnObj);
                        }
                    });


        } else {
            fixture.COLLECTION = [];
        }

        _.each(fixture, function(value, param){
            if(ignoreParams.indexOf(param) === -1) {
                let regBase = new RegExp(`\/api\/${param}`);
                $httpBackend.whenGET(regBase)
                    .respond( (method, url, data, headers) => {
                        console.log('GET',url);
                        headers['Content-Type'] = HEADER_API_VERSION;

                        if(fixture[param]) {
                            return [200, fixture[param]];
                        }

                        console.log("===== MOCK DATA FETCH FAILURE =======");
                        console.log(param);
                        console.log(fixture);

                        return [404];

                    });
            }
        });



        $httpBackend.whenPOST(patternBase)
            .respond((method, url, data, headers) => {

                try {
                    data = addId(JSON.parse(data));
                } catch(e){}

                if(overrides.POST) {

                    return callCustom(overrides.POST, method, url, data, headers);


                } else {
                    console.log('POST', url);
                    headers['Content-Type'] = HEADER_API_VERSION;

                    fixture.COLLECTION.push(data);


                    return [201, {[ID_PROP]: data[ID_PROP]}];
                }
            });


        $httpBackend.whenPUT(patternGet)
            .respond( (method, url, data, headers) => {
                try {
                    data = addId(JSON.parse(data));
                } catch(e){}
                if(overrides.PUT) {

                    return callCustom(overrides.PUT, method, url, data, headers);


                } else {
                    console.log('PUT', url);
                    headers['Content-Type'] = HEADER_API_VERSION;

                    if (!_.has(data, ID_PROP)) {
                        console.log("==== NO " + ID_PROP + " IN THE PUT DATA. NEED THIS AS AN IDENTIFIER!====");
                        return [500];
                    }

                    var id = data[ID_PROP];
                    var foundItem = false;
                    for (var i = 0; i < fixture.COLLECTION.length; i++) {
                        if (_.has(fixture.COLLECTION[i], ID_PROP) && fixture.COLLECTION[i][ID_PROP] == id) {
                            foundItem = true;
                            fixture.COLLECTION[i] = data;
                            break;
                        }
                    }

                    if (!foundItem) {
                        return [404];
                    }


                    //if(data[errorField] === '404') {
                    //    return [404];
                    //} else if(data[errorField] === '409') {
                    //    return [409];
                    //} else if(data[errorField] === '500') {
                    //    return [500];
                    //}

                    return [200, data];
                }
            });

        $httpBackend.whenDELETE(patternGet)
            .respond( (method, url, data, headers) => {
                if(overrides.DELETE) {

                    return callCustom(overrides.DELETE, method, url, data, headers);


                } else {
                    console.log('DELETE', url);
                    headers['Content-Type'] = HEADER_API_VERSION;
                    const id = url.match(patternId)[1];

                    var originalLength = fixture.COLLECTION.length;
                    fixture.COLLECTION = _.filter(fixture.COLLECTION, function (item) {
                        return item[ID_PROP] != id;
                    });

                    if (originalLength == fixture.COLLECTION.length && fixture.COLLECTION.length > 0) {
                        console.log("DELETE couldn't find identifier: ", id);
                        return [404];
                    }

                    //if(id === '404') {
                    //    return [404];
                    //} else if(id === '500') {
                    //    return [500];
                    //}

                    return [204];
                }
            });
        
        /*
            Full stop passthrough
         */
        $httpBackend.whenGET(/^\/api\/.*/).respond((method, url, data, headers) => {
            console.log("==========================");
            console.log("   MOCK API FALLTHROUGH   ");
            headers['Content-Type'] = 'application/json;version=1';
            console.log(url)
            throw new Error("No API Service call for " + url + " declared!");
            return [404];
        
        });
        $httpBackend.whenGET(/^\w+.*/).passThrough();
        $httpBackend.whenPOST(/^\w+.*/).passThrough();
        

        return this;
    }
    filter(url, obj) {
        return filter(url, obj);
    }


}

export default MockHttp;
