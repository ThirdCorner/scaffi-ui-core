'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _dataModel = require('../classes/data-model');

var _dataModel2 = _interopRequireDefault(_dataModel);

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

var _responseLogger = require('../classes/response-logger');

var _responseLogger2 = _interopRequireDefault(_responseLogger);

var _ngDecorators = require('../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ID_PROP, API_BASE;

//start-non-standard

//end-non-standard
var AbstractService = (_dec = (0, _ngDecorators.Inject)('$http', '$state', '$rootScope', '$injector'), _dec(_class = function () {
    function AbstractService($http, $state, $rootScope, $injector) {
        (0, _classCallCheck3.default)(this, AbstractService);

        this.$http = $http;
        this.route = this.getApiRouteName();
        this.$state = $state;
        this.$rootScope = $rootScope;

        this.stateStore = $injector.get("stateStore");
        this.$injector = $injector;

        ID_PROP = _index2.default.config.getIdPropertyName();
        API_BASE = _index2.default.config.getApiBase();
    }

    (0, _createClass3.default)(AbstractService, [{
        key: 'getApiRouteName',
        value: function getApiRouteName() {
            throw new Error('This service needs a function that returns the api route name');
        }
    }, {
        key: 'getPropertyName',
        value: function getPropertyName() {
            throw new Error('This service needs a function that returns the property name that can be found in a json structure');
        }
    }, {
        key: 'getService',
        value: function getService(name) {
            if (!_lodash2.default.endsWith(name, "Service")) {
                name = name + "Service";
            }
            if (this.$injector.has(name)) {
                return this.$injector.get(name);
            }
            return null;
        }
    }, {
        key: 'getBaseUrl',
        value: function getBaseUrl() {
            return API_BASE + ('' + this.route);
        }
    }, {
        key: 'call',
        value: function call(url) {
            var _this = this;

            var that = this;
            return new _bluebird2.default(function (resolve, reject) {
                _this.$http.get(url).then(function (response) {
                    _responseLogger2.default.fire("get", response);
                    if (that.isSuccess(response)) {
                        _parserHelper2.default.convertToApp(response.data);
                        resolve(response.data);
                    } else {
                        reject(new Error("Response Not Successful"));
                    }
                }).catch(function (response) {
                    _responseLogger2.default.fire("get", response);
                    reject(new Error("Response Not Successful"));
                });
            });
        }
    }, {
        key: 'getCacheResource',
        value: function getCacheResource() {
            var _this2 = this;

            return new _bluebird2.default(function (resolve, reject) {
                if (_this2.cachedResource) {
                    resolve(_this2.cachedResource);
                } else {
                    _this2.resource().then(function (data) {
                        _this2.cachedResource = data;
                        resolve(data);
                    }).catch(function (data) {
                        reject(new Error("Response Not Successful"));
                    });
                }
            });
        }
        /*
            This is a GET but won't fail the whole page if it gets a 404
         */

    }, {
        key: 'resource',
        value: function resource(id) {
            var _this3 = this;

            var that = this;
            var url = this.getBaseUrl();
            if (id) {
                url += '/' + id;
            }

            return new _bluebird2.default(function (resolve, reject) {
                _this3.$http.get(url).then(function (response) {
                    _responseLogger2.default.fire("resource", response);
                    if (that.isSuccessJson(response)) {
                        _parserHelper2.default.convertToApp(response.data);

                        var returnData = _this3.stateStore.registerRequest(_this3, url, response.data);
                        if (!id) {
                            _this3.cachedResource = returnData;
                        }

                        resolve(returnData);
                    } else {
                        reject(new Error("Response Not Successful"));
                    }
                }).catch(function (response) {
                    _responseLogger2.default.fire("resource", response);
                    reject(new Error("Response Not Successful"));
                });
            });
        }
    }, {
        key: 'get',
        value: function get(id) {
            var _this4 = this;

            var that = this;
            var url = this.getBaseUrl();
            if (id) {
                url += '/' + id;
            }
            return new _bluebird2.default(function (resolve, reject) {
                _this4.$http.get(url).then(function (response) {
                    _responseLogger2.default.fire(id ? "get" : "list", response);

                    if (that.isSuccessJson(response)) {
                        _parserHelper2.default.convertToApp(response.data);
                        var returnData = _this4.stateStore.registerRequest(_this4, url, response.data);
                        if (!id) {
                            _this4.cachedResource = returnData;
                        }

                        resolve(returnData);
                    } else if (response && response.status == 404) {
                        reject(new Error("Response Not Successful"));
                        _this4.$state.go("404");
                    } else {
                        reject(new Error("Response Not Successful"));
                    }
                }).catch(function (response) {
                    _responseLogger2.default.fire(id ? "get" : "list", response);
                    reject(new Error("Response Not Successful"));
                });
            });
        }
    }, {
        key: 'list',
        value: function list(params) {
            var _this5 = this;

            var that = this;

            var allowedParamNames = ["filter", "query", "offset", "count", "sorting", "page", "limit"];
            /*
                Break any reference with UI
             */

            params = angular.copy(params);

            _lodash2.default.each(params, function (value, name) {
                if (allowedParamNames.indexOf(name) === -1) {
                    throw new Error("You're trying to pass an unknown param to getList: " + name + ". Check the docs for what you're allowed to send via the front end.");
                }
                /*
                    Need to get rid of any filter values that are set as null because that messes up things 
                 */
                if (name == "filter") {
                    var filters = {};
                    _lodash2.default.each(value, function (value, name) {
                        if (value !== null) {
                            filters[name] = value;
                        }
                    });
                    params.filter = filters;
                }
            });

            if (_lodash2.default.has(params, "limit")) {
                params.count = params.limit;
            }

            if (_lodash2.default.has(params, "page")) {
                if (!_lodash2.default.has(params, "count") && !_lodash2.default.has(params, "limit")) {
                    throw new Error("You're trying to filter by page but haven't declared a limit or count");
                }

                var page = _parserHelper2.default.convertToNumber(params.page);
                if (page === 0) {
                    page = 1;
                }

                params.offset = page * params.count - params.count;
            }

            _parserHelper2.default.convertToDateStrings(params);
            var url = this.getBaseUrl();

            return new _bluebird2.default(function (resolve, reject) {

                _this5.$http.get(url, { params: params }).then(function (response) {
                    _responseLogger2.default.fire("list", response);

                    if (that.isSuccessJson(response)) {
                        var responseData = response.data;
                        if ((_lodash2.default.isArray(responseData) || !_lodash2.default.has(responseData, "inlineCount")) && response.headers("content-range")) {
                            var range = response.headers("content-range").split(" ");
                            try {
                                range = range[1].split("/")[1];
                                responseData = {
                                    inlineCount: parseInt(range, 10),
                                    results: responseData
                                };
                            } catch (e) {}
                        }

                        _parserHelper2.default.convertToApp(responseData);
                        response.params = params;
                        resolve(_this5.stateStore.registerRequest(_this5, url, responseData));
                    } else {

                        var data = {
                            inlineCount: 0,
                            results: []

                        };
                        resolve(_this5.stateStore.registerRequest(_this5, url, data));
                    }
                }).catch(function (response) {
                    _responseLogger2.default.fire("list", response);
                    reject(new Error("Response Not Successful"));
                });
            });
        }

        // This will POST or PUT depending if there's an Id

    }, {
        key: 'save',
        value: function save(resource) {

            if (_lodash2.default.has(resource, ID_PROP)) {
                return this.put(resource);
            } else {
                return this.post(resource);
            }
        }
    }, {
        key: 'post',
        value: function post(newResource, opts) {
            var _this6 = this;

            newResource = this.convertToObject(newResource);

            var that = this;
            newResource = angular.copy(newResource);
            _parserHelper2.default.convertToDB(newResource);

            return new _bluebird2.default(function (resolve, reject) {
                _this6.$http.post(API_BASE + ('' + _this6.route), newResource).then(function (response) {
                    _responseLogger2.default.fire("post", response);

                    if (that.isSuccessJson(response)) {
                        resolve(response.data);
                    } else {
                        reject(new Error("Response Not Successful"));
                    }
                }).catch(function (response) {
                    _responseLogger2.default.fire("post", response);
                    reject(new Error("Response Not Successful"));
                });
            });
        }
    }, {
        key: 'put',
        value: function put(updatedResource, opts) {
            var _this7 = this;

            var that = this;

            updatedResource = this.convertToObject(updatedResource);

            updatedResource = angular.copy(updatedResource);
            _parserHelper2.default.convertToDB(updatedResource);

            return new _bluebird2.default(function (resolve, reject) {
                _this7.$http.put(API_BASE + (_this7.route + '/' + updatedResource[ID_PROP]), updatedResource).then(function (response) {
                    _responseLogger2.default.fire("put", response);
                    if (that.isSuccessJson(response)) {
                        resolve(response.data);
                    } else {
                        reject(new Error("Response Not Successful"));
                    }
                }).catch(function (response) {
                    _responseLogger2.default.fire("put", response);
                    reject(new Error("Response Not Successful"));
                });
            });
        }
    }, {
        key: 'delete',
        value: function _delete(id) {
            var _this8 = this;

            var that = this;

            return new _bluebird2.default(function (resolve, reject) {
                _this8.$http.delete(API_BASE + (_this8.route + '/' + id)).then(function (response) {
                    _responseLogger2.default.fire("delete", response);
                    if (that.isSuccess(response)) {

                        resolve(response.data);
                    } else {
                        reject(new Error("Response Not Successful"));
                    }
                }).catch(function (response) {
                    _responseLogger2.default.fire("delete", response);
                    reject(new Error("Response Not Successful"));
                });
            });
        }
    }, {
        key: 'getRoute',
        value: function getRoute() {
            return this.route;
        }
    }, {
        key: 'convertToObject',
        value: function convertToObject(data) {
            var _this9 = this;

            var returnObj = {};
            var parseData = data;

            if (!_lodash2.default.isArray(data) && !_lodash2.default.isObject(data)) {
                return data;
            }
            _lodash2.default.each(parseData, function (value, key) {
                if (_lodash2.default.isFunction(value)) {
                    return;
                }
                switch (true) {
                    // //case value instanceof DataCollection:
                    //     //returnObj[key] = value._export();
                    //     break;
                    case value instanceof _dataModel2.default:
                        returnObj[key] = value.export();
                        break;
                    case _lodash2.default.isArray(value):
                        var returnArray = [];
                        _lodash2.default.each(value, function (item) {
                            returnArray.push(_this9.convertToObject(item));
                        }, _this9);
                        returnObj[key] = returnArray;
                        break;
                    default:
                        if (key.indexOf("_") !== 0) {
                            returnObj[key] = value;
                        }

                }
            }, this);

            return returnObj;
        }
    }, {
        key: 'isSuccess',
        value: function isSuccess(response) {
            return response && response.status > 199 && response.status < 300;
        }
    }, {
        key: 'isSuccessJson',
        value: function isSuccessJson(response) {
            return this.isSuccess(response) && response.data && _lodash2.default.isObject(response.data);
        }
    }, {
        key: '_getCreatedToastMessage',
        value: function _getCreatedToastMessage(response) {
            var msg = "Record successfully created!";
            if (_lodash2.default.isObject(response) && _lodash2.default.has(response, ID_PROP)) {
                msg = 'Record ' + response[ID_PROP] + ' successfully created!';
            } else if (_lodash2.default.isNumber(response)) {
                msg = 'Record ' + response + ' successfully created!';
            }

            return msg;
        }

        /*
            Event handler functions
         */

    }, {
        key: 'configDataModel',
        value: function configDataModel() {
            return true;
        }
    }, {
        key: 'configDataCollection',
        value: function configDataCollection() {
            return true;
        }
    }]);
    return AbstractService;
}()) || _class);
exports.default = AbstractService;