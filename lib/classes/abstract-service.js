'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ID_PROP, API_BASE;

var AbstractService = function () {
    function AbstractService(http, route, $state, $rootScope, $injector) {
        _classCallCheck(this, AbstractService);

        this.http = http;
        this.route = route;
        this.$state = $state;
        this.$rootScope = $rootScope;

        this.stateStore = $injector.get("stateStore");
        this.$injector = $injector;

        ID_PROP = _index2.default.config.getIdPropertyName();
        API_BASE = _index2.default.config.getApiBase();
    }

    _createClass(AbstractService, [{
        key: 'getNamespace',
        value: function getNamespace() {
            return this.namespace;
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

        //
        // /*
        //     For making a LIST request without going in a table
        //  */
        // fetchList() {
        //     var that = this;
        //     return this.http.get(API_BASE + `${this.route}`).then( (response)=> {
        //         console.log(that.route);
        //         that.sendToTestUIHarnessResponse(response);
        //         if(that.isSuccess(response)) {
        //             return response.data;
        //         }
        //         return that.$rootScope.showResourceError(response);
        //     }).catch((response) => {
        //         that.sendToTestUIHarnessResponse(response);
        //         return that.$rootScope.showResourceError(response);
        //     });
        // }

    }, {
        key: 'call',
        value: function call(url) {
            var that = this;
            return this.http.get(url).then(function (response) {
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
            var url = API_BASE + ('' + this.route);
            if (id) {
                url += '/' + id;
            }
            return this.http.get(url).then(function (response) {
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
            var url = API_BASE + ('' + this.route);
            if (id) {
                url += '/' + id;
            }
            return this.http.get(url).then(function (response) {
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
        key: 'getList',
        value: function getList(params) {
            var that = this;
            if (params && params.parameters) {
                var p = angular.copy(params);
                /*
                    count: max display
                    sorting: {param: asc/desc
                    page: #
                    filter
                 */
                p = p.parameters();
                if (p.sorting) {

                    _lodash2.default.each(p.sorting, function (direction, name) {
                        p["sortProperty"] = name;
                        p["sortDirection"] = direction;
                    });
                }
                if (p.filter) {
                    _lodash2.default.each(p.filter, function (value, name) {
                        p[name] = value;
                    }, this);
                }
                _parserHelper2.default.convertToDateStrings(p);
            }
            return this.http.get(API_BASE + ('' + this.route), { params: p }).then(function (response) {
                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {
                    _parserHelper2.default.convertToApp(response.data);
                    response.params = p;
                    return response.data;
                }
                that.$rootScope.showResourceError(response);

                var data = {
                    inlineCount: 0,
                    results: []

                };
                return data;
            }).catch(function (response) {
                that.sendToTestUIHarnessResponse(response);
                return that.$rootScope.showResourceError(response);
            });
        }

        // This will POST or PUT depending if there's an Id

    }, {
        key: 'submit',
        value: function submit(resource) {
            if (_lodash2.default.has(resource, ID_PROP)) {
                return this.update(resource);
            } else {
                return this.create(resource);
            }
        }
    }, {
        key: 'create',
        value: function create(newResource, opts) {
            var _this3 = this;

            var that = this;
            newResource = angular.copy(newResource);
            _parserHelper2.default.convertToDB(newResource);
            newResource.CreatedOn = (0, _moment2.default)().format();
            newResource.ModifiedOn = (0, _moment2.default)().format();

            return this.http.post(API_BASE + ('' + this.route), newResource).then(function (response) {

                that.sendToTestUIHarnessResponse(response);
                if (that.isSuccess(response)) {

                    if (!opts || !opts.silent) {
                        that.$rootScope.showSuccessToast(_this3._getCreatedToastMessage(response));
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
    }, {
        key: 'update',
        value: function update(updatedResource, opts) {
            var that = this;
            updatedResource = angular.copy(updatedResource);
            _parserHelper2.default.convertToDB(updatedResource);
            updatedResource.ModifiedOn = (0, _moment2.default)().format();

            return this.http.put(API_BASE + (this.route + '/' + updatedResource[ID_PROP]), updatedResource).then(function (response) {
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
            return this.http.delete(API_BASE + (this.route + '/' + id)).then(function (response) {
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
}();

exports.default = AbstractService;