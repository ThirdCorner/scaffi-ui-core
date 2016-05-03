'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ID_PROP;

var HEADER_API_VERSION = 'application/json;version=1';

var keptID = Math.floor(Date.now() / 1000);

function parseURL(url) {
    if (url.indexOf("?") === -1) return {};
    var params = url.substr(url.indexOf("?") + 1).split("&");
    //var params = JSON.parse('{"' + decodeURI(url.substr(url.indexOf("?")+1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    var results = [];
    _lodash2.default.each(params, function (part) {
        var item = part.split("=");
        try {
            var str = decodeURIComponent(item[1]).replace(/\+/g, " ");
            results[item[0]] = JSON.parse(str);
        } catch (e) {}
    });
    return results;
}
function _filter(url, obj) {
    var params = parseURL(url);

    obj = angular.copy(obj);
    /*
     SORTING
     */
    if (params.sorting && _lodash2.default.isObject(params.sorting)) {
        var col = [],
            order = [];
        _lodash2.default.each(params.sorting, function (value, name) {
            col.push(name);
            order.push(value);
        });

        if (col.length) {
            obj = _lodash2.default.sortByOrder(obj, col, order);
        }
    }

    var setFilter = function setFilter(filters, name, value) {
        var reservedFilters = ['sorting', 'count', 'page'];
        if (reservedFilters.indexOf(name) === -1) {
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
    var shouldFilterRecord = function shouldFilterRecord(record, filters) {
        var foundRecord = true;
        _lodash2.default.each(filters, function (value, name) {
            if (!_lodash2.default.has(record, name)) {
                foundRecord = false;
                return;
            }
            switch (true) {
                case _lodash2.default.isNumber(value):
                    if (record[name] != value) {
                        foundRecord = false;
                    }
                    break;
                case _lodash2.default.isString(value):
                    if (!_lodash2.default.startsWith(record[name], value)) {
                        foundRecord = false;
                    }
                    break;
                case _lodash2.default.isObject(value):
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

    if (params.filter && _lodash2.default.isObject(params.filter)) {
        var filters = params.filter;
        obj = _lodash2.default.filter(obj, function (record) {
            return shouldFilterRecord(record, filters);
        });
        if (!_lodash2.default.isArray(obj)) {
            obj = [];
        }
    }
    var totalCount = obj.length;
    /*
     COUNT
     */

    if (params.count && _lodash2.default.isNumber(params.count) && params.count != 1) {
        var start = 0;
        var end = params.count;
        if (params.page && _lodash2.default.isNumber(params.page)) {
            start = params.page * params.count - params.count;
            end = start + params.count;
        }
        obj = _lodash2.default.slice(obj, start, end);
    }

    return { inlineCount: totalCount, results: obj };
}
/*
    This is to ensure that nested objects get IDs. For instance, if you're in a page
    and you're adding a "foreign key group", this will add the ids to that foreign group
    as if it were added via the server database.
 */
function addId(data) {

    if (_parserHelper2.default.isObject(data) && !_lodash2.default.has(data, ID_PROP)) {
        keptID++;
        data[ID_PROP] = keptID;
    }
    if (_parserHelper2.default.isContainer(data)) {
        _lodash2.default.each(data, function (value, key) {
            if (_parserHelper2.default.isContainer(value)) {
                data[key] = addId(value);
            }
        }, this);
    }

    return data;
}

var MockHttp = function () {
    function MockHttp() {
        _classCallCheck(this, MockHttp);
    }

    _createClass(MockHttp, [{
        key: 'init',


        /*
            OVERRIDES : ["LIST": (method, url, data, headers) => {}] means it won't call specific default routes so you can override
         */
        value: function init($httpBackend, route, fixture, overrides) {
            if (_index2.default.config.getEnvironment() != "prototype") {
                return false;
            }
            ID_PROP = _index2.default.config.getIdPropertyName();
            overrides = overrides || {};

            //const patternBase = new RegExp(`\/api\/${route}`);
            var patternBase = new RegExp('/api/' + route),
                patternGet = new RegExp('/api/' + route + '/\\d+'),
                patternId = new RegExp('/api/' + route + '/(\\d+)');

            var ignoreParams = ["GET", "LIST"];

            function callSet(headers, statusCode, data) {
                headers['Content-Type'] = HEADER_API_VERSION;

                if (data) {
                    return [statusCode, data];
                } else {
                    return [statusCode];
                }
            }
            function callCustom(fn, method, url, data, headers) {
                var returnData = fn(method, url, data, headers);
                if (returnData.length == 1) {
                    return callSet(headers, returnData[0]);
                } else if (returnData.length == 2) {
                    return callSet(headers, returnData[0], returnData[1]);
                }
            }

            if (fixture.COLLECTION) {

                $httpBackend.whenGET(patternGet).respond(function (method, url, data, headers) {
                    if (overrides.GET) {

                        return callCustom(overrides.GET, method, url, data, headers);
                    } else {

                        var id = parseInt(url.match(patternId)[1], 10);

                        var found = _lodash2.default.find(fixture.COLLECTION, function (item) {
                            return _lodash2.default.has(item, ID_PROP) && item[ID_PROP] == id;
                        });
                        if (found) {
                            return callSet(headers, 200, found);
                        }

                        return callSet(headers, 404);
                    }
                });

                $httpBackend.whenGET(patternBase).respond(function (method, url, data, headers) {
                    if (overrides.LIST) {

                        return callCustom(overrides.LIST, method, url, data, headers);
                    } else {
                        var returnObj = _filter(url, fixture.COLLECTION);

                        return callSet(headers, 200, returnObj);
                    }
                });
            } else {
                fixture.COLLECTION = [];
            }

            _lodash2.default.each(fixture, function (value, param) {
                if (ignoreParams.indexOf(param) === -1) {
                    var regBase = new RegExp('/api/' + param);
                    $httpBackend.whenGET(regBase).respond(function (method, url, data, headers) {
                        console.log('GET', url);
                        headers['Content-Type'] = HEADER_API_VERSION;

                        if (fixture[param]) {
                            return [200, fixture[param]];
                        }

                        console.log("===== MOCK DATA FETCH FAILURE =======");
                        console.log(param);
                        console.log(fixture);

                        return [404];
                    });
                }
            });

            $httpBackend.whenPOST(patternBase).respond(function (method, url, data, headers) {

                try {
                    data = addId(JSON.parse(data));

                    data.CreatedOn = (0, _moment2.default)().format();
                    data.ModifiedOn = (0, _moment2.default)().format();
                } catch (e) {}

                if (overrides.POST) {

                    return callCustom(overrides.POST, method, url, data, headers);
                } else {
                    console.log('POST', url);
                    headers['Content-Type'] = HEADER_API_VERSION;

                    fixture.COLLECTION.push(data);

                    return [201, _defineProperty({}, ID_PROP, data[ID_PROP])];
                }
            });

            $httpBackend.whenPUT(patternGet).respond(function (method, url, data, headers) {
                try {
                    data = addId(JSON.parse(data));
                    data.ModifiedOn = (0, _moment2.default)().format();
                } catch (e) {}
                if (overrides.PUT) {

                    return callCustom(overrides.PUT, method, url, data, headers);
                } else {
                    console.log('PUT', url);
                    headers['Content-Type'] = HEADER_API_VERSION;

                    if (!_lodash2.default.has(data, ID_PROP)) {
                        console.log("==== NO " + ID_PROP + " IN THE PUT DATA. NEED THIS AS AN IDENTIFIER!====");
                        return [500];
                    }

                    var id = data[ID_PROP];
                    var foundItem = false;
                    for (var i = 0; i < fixture.COLLECTION.length; i++) {
                        if (_lodash2.default.has(fixture.COLLECTION[i], ID_PROP) && fixture.COLLECTION[i][ID_PROP] == id) {
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

            $httpBackend.whenDELETE(patternGet).respond(function (method, url, data, headers) {
                if (overrides.DELETE) {

                    return callCustom(overrides.DELETE, method, url, data, headers);
                } else {
                    var originalLength;

                    var _ret = function () {
                        console.log('DELETE', url);
                        headers['Content-Type'] = HEADER_API_VERSION;
                        var id = url.match(patternId)[1];

                        originalLength = fixture.COLLECTION.length;

                        fixture.COLLECTION = _lodash2.default.filter(fixture.COLLECTION, function (item) {
                            return item[ID_PROP] != id;
                        });

                        if (originalLength == fixture.COLLECTION.length && fixture.COLLECTION.length > 0) {
                            console.log("DELETE couldn't find identifier: ", id);
                            return {
                                v: [404]
                            };
                        }

                        //if(id === '404') {
                        //    return [404];
                        //} else if(id === '500') {
                        //    return [500];
                        //}

                        return {
                            v: [204]
                        };
                    }();

                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                }
            });

            return this;
        }
    }, {
        key: 'filter',
        value: function filter(url, obj) {
            return _filter(url, obj);
        }
    }]);

    return MockHttp;
}();

exports.default = MockHttp;