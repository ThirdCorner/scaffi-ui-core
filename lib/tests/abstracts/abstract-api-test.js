'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _abstractTest = require('./abstract-test');

var _abstractTest2 = _interopRequireDefault(_abstractTest);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    This handles parsing through opts shared through all testing classes.
 */

var AbstractApiTest = function (_AbstractTest) {
    (0, _inherits3.default)(AbstractApiTest, _AbstractTest);

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

    function AbstractApiTest(opts) {
        (0, _classCallCheck3.default)(this, AbstractApiTest);

        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AbstractApiTest).call(this, opts));

        _this.ID_PROP = _index2.default.config.getIdPropertyName();
        _this.API_BASE = _index2.default.config.getApiBase();

        _this.opts = {
            allowedRest: ['GET', 'PUT', 'POST', 'DELETE', 'LIST']
        };

        (0, _extends3.default)(_this.opts, opts);

        if (_this.opts.route) {
            var route = _this.opts.route;
            var routes = {
                GET: { route: route + "/:id" },
                POST: { route: route },
                PUT: { route: route + "/:id" },
                DELETE: { route: route + "/:id" },
                LIST: { route: route }
            };
            if (_this.opts.routeOpts) {
                var routeOpts = _this.opts.routeOpts;
                _this.opts.routeOpts = (0, _extends3.default)(routes, routeOpts);
            } else {
                _this.opts.routeOpts = routes;
            }
        }
        _this.baseUrl = _this.API_BASE;
        _this.data = {};
        if (_this.opts.fixtures) {
            _this.addTest(_this._generateFixturesTest(_this.opts));
        }

        if (_this.opts.showResponse) {
            _this.showResponseEnabled = true;
        }
        if (_this.opts.debug) {
            _this.enableDebugging();
        }
        if (_this.opts.revertData) {
            _this.revertData = _this.opts.revertData;
        }

        _this.initialize();
        return _this;
    }

    (0, _createClass3.default)(AbstractApiTest, [{
        key: 'shouldShowResponse',
        value: function shouldShowResponse() {
            return this.showResponseEnabled;
        }
    }, {
        key: 'getRoute',
        value: function getRoute(methodType) {
            if (this.opts.routeOpts && _lodash2.default.has(this.opts.routeOpts, methodType)) {
                return this.opts.routeOpts[methodType].route;
            } else {
                return this.opts.route;
            }
        }
    }, {
        key: 'makeServerUrl',
        value: function makeServerUrl(route) {
            return this.baseUrl + route;
        }
    }, {
        key: 'makeServerOpts',
        value: function makeServerOpts(RESTType, route) {

            if (!route) {
                this.throwError("You must set an opts.route for this specific test!", route);
            }

            var options = {
                method: RESTType,
                json: true
            };

            options.uri = this.makeServerUrl(route);

            return options;
        }
    }, {
        key: 'getRESTOptions',
        value: function getRESTOptions(RESTType, opts) {
            console.log(opts);
            var mergedOpts = this.copy(this.opts);

            if (opts) {
                (0, _extends3.default)(mergedOpts, opts);
            }
            if (_lodash2.default.has(this.opts.routeOpts, RESTType)) {
                (0, _extends3.default)(mergedOpts, this.opts.routeOpts[RESTType]);
            }

            return mergedOpts;
        }
    }, {
        key: 'getFixture',
        value: function getFixture() {
            return this.opts.fixture;
        }
    }, {
        key: 'setFixture',
        value: function setFixture(fixture) {
            this.opts.fixture = fixture;
        }
    }, {
        key: 'fetchData',
        value: function fetchData(options) {
            return (0, _requestPromise2.default)(options);
        }
    }, {
        key: '_makeRouteOpts',
        value: function _makeRouteOpts(opts, RESTType) {
            opts = copy(opts);
            if (opts.routeOpts && _lodash2.default.has(opts.routeOpts, RESTType)) {
                opts = (0, _extends3.default)(opts, opts.routeOpts[RESTType]);
            }

            return opts;
        }
    }, {
        key: 'clearDataStore',
        value: function clearDataStore() {
            this.data = {};
        }
    }, {
        key: 'getData',
        value: function getData(name) {
            return this.data[name] || null;
        }
    }, {
        key: 'setData',
        value: function setData(name, value) {
            this.data[name] = value;
        }
    }, {
        key: '_getTestUrl',
        value: function _getTestUrl(opts, id) {
            if (!opts.route) {
                this.throwError("You must set an opts.route for this specific test!", opts);
            }
            var url = this.baseUrl + opts.route;
            if (id && url.indexOf(":id") !== -1) {
                url = url.replace(":id", id);
            }
            return url;
        }
    }, {
        key: '_checkAllowed',
        value: function _checkAllowed(RESTOpts) {
            if (!this.opts.allowedRest) {
                return true;
            }
            return this.opts.allowedRest.indexOf(RESTOpts) !== -1;
        }
    }, {
        key: 'allowGET',
        value: function allowGET() {
            return this._checkAllowed("GET");
        }
    }, {
        key: 'allowPOST',
        value: function allowPOST() {
            return this._checkAllowed("POST");
        }
    }, {
        key: 'allowPUT',
        value: function allowPUT() {
            return this._checkAllowed("PUT");
        }
    }, {
        key: 'allowDELETE',
        value: function allowDELETE() {
            return this._checkAllowed("DELETE");
        }
    }, {
        key: 'allowLIST',
        value: function allowLIST() {
            return this._checkAllowed("LIST");
        }
    }]);
    return AbstractApiTest;
}(_abstractTest2.default);

exports.default = AbstractApiTest;