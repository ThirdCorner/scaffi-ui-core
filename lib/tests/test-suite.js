"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require("chai-as-promised");

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _describeBlock = require("./common/describe-block");

var _describeBlock2 = _interopRequireDefault(_describeBlock);

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

var _expectTests = require("./common/expect-tests");

var _expectTests2 = _interopRequireDefault(_expectTests);

var _testDataHandler = require("./common/test-data-handler");

var _testDataHandler2 = _interopRequireDefault(_testDataHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

var ID_PROP = _index2.default.config.getIdPropertyName();
var API_BASE = _index2.default.config.getApiBase();

//import TestSuiteForms from './TestSuiteForms';

//import TestRest from './TestRest';

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function fetchData(options) {
    return (0, _requestPromise2.default)(options);
}

var TestSuite = function () {
    /*
    TODO: Test that clearStorage is working between suite tests and single tests
        {
            allowedRest: ['GET', 'PUT'] etc GET, PUT, POST, DELETE
                If get is not allowed, PUT and POST assume success based on 200, rather than fetching list and making
                sure values got set.
            route: 'suppliers' (OPTIONAL)
                ( route to call for each test. Will be overriden if a different route is provided in individual test calls, like testPOST
                default:
                    GET: 'api/suppliers/1'
                    POST: 'api/suppliers'
                    PUT: 'api/suppliers/1'
                    DELETE: 'api/suppliers/1'
                    LIST: 'api/suppliers'
                )
            fixtures: {}
                Array of fixture collections and routes to run tests against
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
              }
        }
        restOpts: ['GET', 'PUT'] etc
     */

    function TestSuite(opts) {
        _classCallCheck(this, TestSuite);

        console.log("TETTTTTTTTTTTTTTTTT SUITE");
        this.opts = {
            allowedRest: ['GET', 'PUT', 'POST', 'DELETE', 'LIST']
        };

        Object.assign(this.opts, opts);

        if (this.opts.route) {
            var route = this.opts.route;
            var routes = {
                GET: { route: route + "/:id" },
                POST: { route: route },
                PUT: { route: route + "/:id" },
                DELETE: { route: route + "/:id" }
            };
            if (this.opts.routeOpts) {
                var routeOpts = this.opts.routeOpts;
                this.opts.routeOpts = Object.assign(routes, routeOpts);
            } else {
                this.opts.routeOpts = routes;
            }
        }
        this.baseUrl = API_BASE;
        this.data = {};

        if (this.opts.fixtures) {
            this.addTest(this._generateFixturesTest(this.opts));
        }
    }

    _createClass(TestSuite, [{
        key: "_makeRouteOpts",
        value: function _makeRouteOpts(opts, RESTType) {

            var newOpts = copy(this.opts);
            if (newOpts.routeOpts && _lodash2.default.has(newOpts.routeOpts, RESTType)) {
                newOpts = Object.assign(newOpts, newOpts.routeOpts[RESTType]);
            }
            if (opts) {
                newOpts = Object.assign(newOpts, opts);
            }

            return newOpts;
        }

        /*
            See above for explainations
            opts = {
                fixtures: []
                allowedRest: []
                route: ""
                ignoreProperties: []
                routeOpts
            }
         */

    }, {
        key: "testFixtures",
        value: function testFixtures(opts) {
            this.tests.push(this._generateFixturesTest(opts));
        }
    }, {
        key: "_generateFixturesTest",
        value: function _generateFixturesTest(opts) {

            if (!opts) {
                opts = this.opts;
            }
            if (!opts.fixtures) {
                this.throwError("You must provide fixtures in arg opts in order to call testFixtures");
                return;
            }

            var Describe = new _describeBlock2.default("Testing Fixtures");
            _lodash2.default.each(opts.fixtures, function (fixture, name) {
                if (name == 'COLLECTION') {
                    var collectionOpts = copy(opts);
                    collectionOpts.collection = fixture;
                    Describe.describe("Testing Collections", this._generateCollectionsTest(collectionOpts));
                } else {
                    var getOpts = this._makeRouteOpts(opts, "GET");
                    Describe.describe("Testing GET route " + name, this._generateGETTest(getOpts));
                }
            }, this);

            return Describe;
        }
        /*
         See above for explainations
         opts = {
             collection: []
             allowedRest: []
             route: ""
             ignoreProperties: []
             routeOpts: {}
         }
         */

    }, {
        key: "testCollections",
        value: function testCollections(opts) {
            this.tests.push(this._generateCollectionsTest(opts));
        }
    }, {
        key: "_generateCollectionsTest",
        value: function _generateCollectionsTest(opts) {
            var that = this;

            if (!_lodash2.default.isArray(opts.collection)) {
                this.throwError("testCollections must be provided a collection in its opts!", opts);
                return false;
            }

            var Describe = new _describeBlock2.default("Testing Collections");

            _lodash2.default.each(opts.collection, function (fixObj, index) {
                var CollectDescribe = new _describeBlock2.default();
                Describe.describe("Collection #" + index, CollectDescribe);
                CollectDescribe.before(function () {
                    that.clearDataStore();
                });

                opts.fixture = fixObj;

                //  var tr = new TestRest(opts);

                if (this.allowPOST(opts)) {
                    CollectDescribe.describe("Testing POST Route", this._generatePOSTTest(null, false));
                    if (this.allowPUT(opts)) {
                        CollectDescribe.describe("Testing PUT Route", this._generatePUTTest(null, false));
                    }
                } else if (this.allowPUT(opts)) {
                    CollectDescribe.describe("Testing PUT  Route", this._generatePUTTest(null, false));
                } else if (this.allowGET(opts)) {
                    CollectDescribe.describe("Testing GET Route", this._generateGETTest(null, false));
                }
                CollectDescribe.after(function () {
                    that.clearDataStore();
                });
            }, this);

            return Describe;
        }
        /*
         See above for explainations
         opts = {
             fixture
             route: ""
         }
         */

    }, {
        key: "testGET",
        value: function testGET(opts) {
            this.tests.push(this._generateGETTest(opts));
        }
    }, {
        key: "_generateGETTest",
        value: function _generateGETTest(opts, clearTestMemory) {
            var _this = this;

            clearTestMemory = _lodash2.default.isUndefined(clearTestMemory) ? true : clearTestMemory;

            var getOpts = this._makeRouteOpts(opts, "GET");
            if (!getOpts.fixture && this.getData("fixture")) {
                console.log("!!!-----FILLING IN FIXTURE FROM STORAGE", this.getData("fixture"));
                getOpts.fixture = this.getData("fixture");
            }

            if (!getOpts.route || !getOpts.fixture) {
                this.throwError("Must provide a fixture and route to call testPUT with GET allowed", opts);
                return;
            }

            var Describe = new _describeBlock2.default();
            var fixture = copy(getOpts.fixture),
                fetchedData,
                that = this,
                id,
                error = null,
                options;

            Describe.before(function (done) {
                id = fixture[ID_PROP];
                if (!id) {
                    _this.throwError("Your GET fixture must have an '" + ID_PROP + "' as a proprety.", getOpts.fixture);
                    return false;
                }

                options = {
                    method: "GET",
                    uri: _this._getTestUrl(getOpts, id),
                    json: true
                };

                fetchData(options).then(function (body) {
                    fetchedData = body;
                    _testDataHandler2.default.matchFixtureProperties(fixture, fetchedData, true);
                    _testDataHandler2.default.fixValuesForComparison(fixture, fetchedData);
                    _this.setData("fixture", fetchedData);
                    done();
                }).catch(function (e) {
                    error = e;
                    done();
                });
            });

            Describe.it("should NOT error on API calls", function () {
                if (error) {
                    that.throwError(error.statusCode + ": " + JSON.stringify(error.error), options);
                }
                expect(error).to.be.null;
            });

            var GetDescribeText = "GET attempt";

            var GetDescribe = new _describeBlock2.default();
            Describe.describe(GetDescribeText, GetDescribe);

            GetDescribe.it("should have ID", function () {
                expect(id).to.be.a("number");
            });

            GetDescribe.it("should submit successfully", function () {
                expect(fetchedData).to.have.all.keys(fixture);
            });

            GetDescribe.it("should have the right property types", function () {
                var serverTypes = _testDataHandler2.default.getDataTypeMap(fetchedData);
                var fixtureTypes = _testDataHandler2.default.getDataTypeMap(fixture);

                expect(serverTypes).to.eql(fixtureTypes);
            });

            if (clearTestMemory) {
                Describe.after(function () {
                    that.clearDataStore();
                });
            }

            return Describe;
        }
        /*
            opts = {
                fixture: {},
                route: ""
                routeOpts: {}
                allowedRest: []
                ignoreProperties: []
            }
         */

    }, {
        key: "testPUT",
        value: function testPUT(opts) {
            this.tests.push(this._generatePUTTest(opts));
        }
    }, {
        key: "_generatePUTTest",
        value: function _generatePUTTest(opts, clearTestMemory) {
            var _this2 = this;

            clearTestMemory = _lodash2.default.isUndefined(clearTestMemory) ? true : clearTestMemory;

            var putOpts = this._makeRouteOpts(opts, "PUT");

            if (!putOpts.fixture && this.getData("fixture")) {
                console.log("!!!-----FILLING IN FIXTURE FROM STORAGE", this.getData("fixture"));
                putOpts.fixture = this.getData("fixture");
            }

            if (!putOpts.route || !putOpts.fixture) {
                console.log(putOpts);
                this.throwError("Must provide a fixture and route to call testPUT", putOpts);
                return;
            }
            var getOpts;
            if (this.allowGET(opts)) {
                getOpts = this._makeRouteOpts(opts, "GET");
                if (!getOpts.fixture && putOpts.fixture) {
                    getOpts.fixture = putOpts.fixture;
                }
                if (!getOpts.route || !getOpts.fixture) {
                    this.throwError("Must provide a fixture and route to call testPUT with GET allowed", getOpts);
                    return;
                }
            }

            var Describe = new _describeBlock2.default();
            var putFixture,
                putFetchedData,
                that = this,
                allowGET = this.allowGET(opts),
                id,
                error = null,
                options;

            Describe.before(function (done) {
                id = that.getData("POST:id") || putOpts.fixture[ID_PROP];

                if (!id) {
                    _this2.throwError("POST is not allowed and collection does not have an id so could not perform a PUT test. Expecting '" + ID_PROP + "' for the id property name.", putOpts.fixture);
                    return false;
                }
                putFixture = _testDataHandler2.default.changeDataBasedOnType(copy(putOpts.fixture), putOpts.ignoreProperties);
                putFixture[ID_PROP] = id;
                options = {
                    method: "PUT",
                    form: putFixture,
                    uri: _this2._getTestUrl(putOpts, id),
                    json: true
                };

                fetchData(options).then(function (body) {

                    if (allowGET && id) {

                        options = {
                            method: "GET",
                            uri: _this2._getTestUrl(getOpts, id),
                            json: true
                        };
                        fetchData(options).then(function (body) {
                            putFetchedData = body;
                            _testDataHandler2.default.matchFixtureProperties(putFixture, putFetchedData);
                            _testDataHandler2.default.fixValuesForComparison(putFixture, putFetchedData);
                            _this2.setData("fixture", putFetchedData);
                            done();
                        }).catch(function (e) {
                            error = e;
                            done();
                        });
                    } else if (body) {
                        putFetchedData = putFixture;
                        _this2.setData("fixture", putFixture);
                        done();
                    } else {
                        done();
                    }
                }).catch(function (e) {
                    error = e;
                    done();
                });
            });

            Describe.it("should NOT error on API calls", function () {
                if (error) {
                    that.throwError(error.statusCode + ": " + JSON.stringify(error.error), options);
                }
                expect(error).to.be.null;
            });

            var PutDescribeText = "PUT attempt";
            if (allowGET) {
                PutDescribeText = "PUT/GET attempt";
            }

            var PutDescribe = new _describeBlock2.default();
            Describe.describe(PutDescribeText, PutDescribe);

            PutDescribe.it("should have ID", function () {
                expect(id).to.be.a("number");
            });

            PutDescribe.it("should submit successfully", function () {
                expect(putFetchedData).to.have.all.keys(putFixture);
            });

            PutDescribe.it("should have the right property types", function () {
                var serverTypes = _testDataHandler2.default.getDataTypeMap(putFetchedData);
                var fixtureTypes = _testDataHandler2.default.getDataTypeMap(putFixture);

                expect(serverTypes).to.eql(fixtureTypes);
            });

            PutDescribe.it("should equal fixture values", function () {
                expect(putFetchedData).to.eql(putFixture);
            });

            if (clearTestMemory) {
                Describe.after(function () {
                    that.clearDataStore();
                });
            }

            return Describe;
        }
        /*
         opts = {
             fixture: {},
             route: ""
             routeOpts: {}
             allowedRest: []
             ignoreProperties: []
         }
         */

    }, {
        key: "testPOST",
        value: function testPOST(opts, describe) {
            this.tests.push(this._generatePOSTTest(opts));
        }
    }, {
        key: "_generatePOSTTest",
        value: function _generatePOSTTest(opts, clearTestMemory) {
            var _this3 = this;

            clearTestMemory = _lodash2.default.isUndefined(clearTestMemory) ? true : clearTestMemory;

            var postOpts = this._makeRouteOpts(opts, "POST");
            if (!postOpts.fixture && this.getData("fixture")) {
                console.log("!!!-----FILLING IN FIXTURE FROM STORAGE", this.getData("fixture"));
                postOpts.fixture = this.getData("fixture");
            }

            if (!postOpts.route || !postOpts.fixture) {
                this.throwError("Must provide a fixture and route to call testPOST", opts);
                return;
            }

            var getOpts;
            if (this.allowGET(opts)) {
                getOpts = this._makeRouteOpts(opts, "GET");
                if (!getOpts.fixture && postOpts.fixture) {
                    getOpts.fixture = postOpts.fixture;
                }
                if (!getOpts.route || !getOpts.fixture) {
                    this.throwError("Must provide a fixture and route to call testPUT with GET allowed", opts);
                    return;
                }
            }

            var Describe = new _describeBlock2.default();
            var fixture = copy(postOpts.fixture),
                fetchedData,
                that = this,
                allowGET = this.allowGET(opts),
                id,
                error = null,
                options;

            Describe.before(function (done) {

                delete fixture[ID_PROP];
                options = {
                    method: "POST",
                    form: fixture,
                    uri: _this3._getTestUrl(postOpts),
                    json: true
                };
                fetchData(options).then(function (body) {
                    if (_lodash2.default.isObject(body) && body[ID_PROP]) {
                        id = body[ID_PROP];
                        fetchedData = body;
                        _this3.setData("fixture", fetchedData);
                    } else if (_lodash2.default.isNumber(body)) {
                        id = body;
                        fetchedData = fixture;
                        _this3.setData("fixture", fetchedData);
                    }

                    that.setData("POST:id", id);

                    if (allowGET && id) {
                        options = {
                            method: "GET",
                            uri: _this3._getTestUrl(getOpts, id),
                            json: true
                        };

                        fetchData(options).then(function (body) {
                            fixture[ID_PROP] = id;
                            fetchedData = body;
                            _testDataHandler2.default.matchFixtureProperties(fixture, fetchedData);
                            _testDataHandler2.default.fixValuesForComparison(fixture, fetchedData);
                            _this3.setData("fixture", fetchedData);
                            done();
                        }).catch(function (e) {
                            error = e;
                            done();
                        });
                    } else {
                        done();
                    }
                }).catch(function (e) {
                    error = e;
                    done();
                });
            });

            Describe.it("should NOT error on API calls", function () {
                console.log(error);
                if (error) {
                    that.throwError(error.statusCode + ": " + JSON.stringify(error.error), options);
                }
                expect(error).to.be.null;
            });

            var PostDescribeText = "POST attempt";
            if (allowGET) {
                PostDescribeText = "POST/GET attempt";
            }

            var PostDescribe = new _describeBlock2.default();
            Describe.describe(PostDescribeText, PostDescribe);

            PostDescribe.it("should have ID", function () {
                expect(id).to.be.a("number");
            });

            PostDescribe.it("should submit successfully", function () {
                expect(fetchedData).to.have.all.keys(fixture);
            });

            PostDescribe.it("should have the right property types", function () {
                var serverTypes = _testDataHandler2.default.getDataTypeMap(fetchedData);
                var fixtureTypes = _testDataHandler2.default.getDataTypeMap(fixture);
                expect(serverTypes).to.eql(fixtureTypes);
            });

            PostDescribe.it("should equal FIXTURE values", function () {
                expect(fetchedData).to.eql(fixture);
            });

            if (clearTestMemory) {
                Describe.after(function () {
                    that.clearDataStore();
                });
            }

            return Describe;
        }
    }, {
        key: "throwError",
        value: function throwError(errorMsg, data) {
            console.log("============ERROR============");
            console.log("MSG: ", errorMsg);
            if (data) {
                console.log("DATA: ", data);
            }
            console.log("=============================");
            throw errorMsg;
        }
    }, {
        key: "clearDataStore",
        value: function clearDataStore() {
            this.data = {};
        }
    }, {
        key: "getData",
        value: function getData(name) {
            return this.data[name] || null;
        }
    }, {
        key: "setData",
        value: function setData(name, value) {
            this.data[name] = value;
        }
    }, {
        key: "_getTestUrl",
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
        key: "_checkAllowed",
        value: function _checkAllowed(opts, RESTOpts) {
            if (!opts || !opts.allowedRest) {
                return true;
            }
            return opts.allowedRest.indexOf(RESTOpts) !== -1;
        }
    }, {
        key: "allowGET",
        value: function allowGET(opts) {
            return this._checkAllowed(opts, "GET");
        }
    }, {
        key: "allowPOST",
        value: function allowPOST(opts) {
            return this._checkAllowed(opts, "POST");
        }
    }, {
        key: "allowPUT",
        value: function allowPUT(opts) {
            return this._checkAllowed(opts, "PUT");
        }
    }, {
        key: "allowDELETE",
        value: function allowDELETE(opts) {
            return this._checkAllowed(opts, "DELETE");
        }
    }, {
        key: "allowLIST",
        value: function allowLIST(opts) {
            return this._checkAllowed(opts, "LIST");
        }

        /*
            Each object in the REST properties is what you're expecting back, in case
            something gets changed between post and get etc
            {
                POST: {}
                GET: {}
                PUT: {}
                DELETE: {}
                  Exclude any you don't want to test. Don't worry about the id property
            }
         */
        /*
            sequenceArr: [
                  Row of routeOpts from above done in sequence so you can start with one structure and then test to
                  make sure the structure changes
                  {
                    type: "POST",
                    route: "wells", (optional if provided in constructor
                    fixture: {},
                    ignoreProperties [] (optional if provided above)
                  }
            ]
         */
        //testRESTSequence(describe, sequenceArr) {
        //    if(!_.isArray(sequenceArr)) {
        //        throw "testRESTSequence takes an array. An array was not given.";
        //    }
        //    var Describe = new DescribeBlock(describe);
        //    _.each(sequenceArr, function(restOpts){
        //        if(!restOpts.type) {
        //            throw "You must provide a type in each testRESTSequence objects.";
        //        }
        //
        //        var name = "_generate" + restOpts.type.toUpperCase() + "Test";
        //        Describe.describe("", [name](restOpts));
        //
        //    }, this);
        //    this.tests.push(Describe);
        //}

    }]);

    return TestSuite;
}();

exports.default = TestSuite;