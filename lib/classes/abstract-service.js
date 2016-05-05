'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

var _ngDecorators = require('../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ID_PROP, API_BASE;

//start-non-standard

//end-non-standard
var AbstractService = (_dec = (0, _ngDecorators.Inject)('$http', '$state', '$rootScope', '$injector'), _dec(_class = function () {
    function AbstractService($http, $state, $rootScope, $injector) {
        _classCallCheck(this, AbstractService);

        this.$http = $http;
        this.route = this.getApiRouteName();
        this.$state = $state;
        this.$rootScope = $rootScope;

        this.stateStore = $injector.get("stateStore");
        this.$injector = $injector;

        ID_PROP = _index2.default.config.getIdPropertyName();
        API_BASE = _index2.default.config.getApiBase();
    }

    _createClass(AbstractService, [{
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
            var that = this;
            return this.$http.get(url).then(function (response) {
                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {
                    _parserHelper2.default.convertToApp(response.data);
                    return response.data;
                }
                return that.$rootScope.showResourceError(response);
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showResourceError(response);
            });
        }
        /*
            This is a GET but won't fail the whole page if it gets a 404
         */

    }, {
        key: 'resource',
        value: function resource(id) {
            var _this = this;

            var that = this;
            var url = this.getBaseUrl();
            if (id) {
                url += '/' + id;
            }
            return this.$http.get(url).then(function (response) {
                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {
                    _parserHelper2.default.convertToApp(response.data);

                    return _this.stateStore.registerRequest(_this, url, response.data);

                    // if(id) {
                    //     return new DataModel(that.route, response.data);
                    // } else {
                    //     return new DataCollection(that.route, response.data);
                    // }
                }
                return that.$rootScope.showResourceError(response);
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showResourceError(response);
            });
        }
    }, {
        key: 'get',
        value: function get(id) {
            var _this2 = this;

            var that = this;
            var url = this.getBaseUrl();
            if (id) {
                url += '/' + id;
            }
            return this.$http.get(url).then(function (response) {
                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {
                    _parserHelper2.default.convertToApp(response.data);

                    var returnData;
                    return _this2.stateStore.registerRequest(_this2, url, response.data);

                    // if(id) {
                    //     returnData = new DataModel(that.route, response.data);
                    // } else {
                    //     returnData = new DataCollection(that.route, response.data);
                    // }

                    return returnData;
                }
                if (response && response.status == 404) {
                    _this2.$state.go("404");
                }
                return that.$rootScope.showServerError(response);
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showServerError(response);
            });
        }
    }, {
        key: 'list',
        value: function list(params) {
            var _this3 = this;

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
            return this.$http.get(url, { params: params }).then(function (response) {
                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {
                    _parserHelper2.default.convertToApp(response.data);
                    response.params = params;
                    return _this3.stateStore.registerRequest(_this3, url, response.data);
                }
                that.$rootScope.showResourceError(response);

                var data = {
                    inlineCount: 0,
                    results: []

                };
                return _this3.stateStore.registerRequest(_this3, url, data);
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showResourceError(response);
            });
        }

        // This will POST or PUT depending if there's an Id

    }, {
        key: 'save',
        value: function save(resource) {
            if (_lodash2.default.has(resource, ID_PROP)) {
                return this.update(resource);
            } else {
                return this.post(resource);
            }
        }
    }, {
        key: 'post',
        value: function post(newResource, opts) {
            var _this4 = this;

            var that = this;
            newResource = angular.copy(newResource);
            _parserHelper2.default.convertToDB(newResource);

            return this.$http.post(API_BASE + ('' + this.route), newResource).then(function (response) {

                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {

                    if (!opts || !opts.silent) {
                        that.$rootScope.showSuccessToast(_this4._getCreatedToastMessage(response));
                    }
                    return response.data;
                }
                return that.$rootScope.showServerError(response);
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showServerError(response);
            });
        }
    }, {
        key: 'put',
        value: function put(updatedResource, opts) {
            var that = this;
            updatedResource = angular.copy(updatedResource);
            _parserHelper2.default.convertToDB(updatedResource);

            return this.$http.put(API_BASE + (this.route + '/' + updatedResource[ID_PROP]), updatedResource).then(function (response) {
                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {
                    that.$rootScope.showSuccessToast('Record #' + updatedResource[ID_PROP] + ' successfully updated!');
                    return response.data;
                }
                return that.$rootScope.showServerError(response);
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showServerError(response);
            });
        }
    }, {
        key: 'delete',
        value: function _delete(id) {
            var that = this;
            return this.$http.delete(API_BASE + (this.route + '/' + id)).then(function (response) {
                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {
                    that.$rootScope.showSuccessToast('Record #' + id + ' successfully deleted!');
                    return response.data;
                }
                return that.$rootScope.showServerError(response);
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showServerError(response);
            });
        }
    }, {
        key: 'getRoute',
        value: function getRoute() {
            return this.route;
        }
    }, {
        key: 'sendToTestUIHarnessResponse',
        value: function sendToTestUIHarnessResponse(response) {
            if (_lodash2.default.has(this.$rootScope, "addTestUIHarnessResponse") && _lodash2.default.isFunction(this.$rootScope["addTestUIHarnessResponse"])) {
                this.$rootScope["addTestUIHarnessResponse"](response);
            }
        }
    }, {
        key: 'isSuccess',
        value: function isSuccess(response) {
            return response && response.status > 199 && response.status < 300;
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