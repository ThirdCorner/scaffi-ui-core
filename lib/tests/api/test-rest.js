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

var _testDataHandler = require("../common/test-data-handler");

var _testDataHandler2 = _interopRequireDefault(_testDataHandler);

var _abstractApiTest = require("../abstracts/abstract-api-test");

var _abstractApiTest2 = _interopRequireDefault(_abstractApiTest);

var _describeBlock = require("../common/describe-block");

var _describeBlock2 = _interopRequireDefault(_describeBlock);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

var TestRest = function (_AbstractApiTest) {
    _inherits(TestRest, _AbstractApiTest);

    function TestRest() {
        _classCallCheck(this, TestRest);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TestRest).apply(this, arguments));
    }

    _createClass(TestRest, [{
        key: "initialize",
        value: function initialize() {

            // Need to redo this so I can build the text dynamically. This is AbstractTest.js
            this.Describe = new _describeBlock2.default("TESTING " + this.API_BASE);
            this.addTest(this.Describe);

            this.error = null;

            if (this.opts.id && !this.opts.fixture) {
                this.callGET();
            }
        }
        //outputTests(){
        //    this.Describe.output();
        //
        //    this.Describe = new DescribeBlock();
        //    this.error = null;
        //
        //
        //}

    }, {
        key: "getIgnoreProperties",
        value: function getIgnoreProperties() {
            if (this.opts.ignoreProperties) {
                return this.opts.ignoreProperties;
            }

            return [];
        }
    }, {
        key: "getID",
        value: function getID() {
            return this.opts.id;
        }
    }, {
        key: "setIDFromResponse",
        value: function setIDFromResponse(response) {
            if (_lodash2.default.isNumber(response)) {
                this.opts.id = response;
            } else if (_lodash2.default.isObject(response) && _lodash2.default.has(response, this.ID_PROP)) {
                this.opts.id = response[this.ID_PROP];
                if (!_lodash2.default.isNumber(response[this.ID_PROP])) {
                    this.opts.id = parseInt(response[this.ID_PROP], 10);
                }
            }
        }
    }, {
        key: "callServer",
        value: function callServer(methodType, changeFixture, params, callback) {
            var _this2 = this;

            var that = this;

            this.Describe.before(function (done) {

                var customFixture = false,
                    currentFixture = that.getFixture(),
                    newFixture;
                var id = that.getID();

                if (changeFixture) {
                    customFixture = true;
                    if (_lodash2.default.isObject(currentFixture)) {
                        currentFixture = that.copy(currentFixture);
                    }

                    if (_lodash2.default.isFunction(changeFixture)) {
                        currentFixture = changeFixture(currentFixture);
                    } else {
                        currentFixture = that.copy(changeFixture);
                    }

                    newFixture = currentFixture;

                    if (_lodash2.default.has(newFixture, that.ID_PROP)) {
                        id = newFixture[that.ID_PROP];
                    }
                } else if (_lodash2.default.isObject(currentFixture)) {
                    newFixture = that.copy(currentFixture);
                }

                var options = that.makeServerOpts(methodType, _this2.getRoute(methodType));

                switch (methodType) {
                    case "GET":
                        if (!id && _lodash2.default.isObject(newFixture) && newFixture[that.ID_PROP]) {
                            id = newFixture[that.ID_PROP];
                        }

                        if (!id) {
                            that.throwError("ID not provide for GET requset", that.opts);
                        }

                        break;
                    case "POST":
                        if (id) {
                            id = null;
                        }
                        if (_lodash2.default.isObject(newFixture) && newFixture[that.ID_PROP]) {
                            delete newFixture[that.ID_PROP];
                        }

                        if (!newFixture) {
                            that.throwError("newFixture not provided for POST request", that.opts);
                        }

                        break;
                    case "PUT":
                        if (!id && _lodash2.default.isObject(newFixture) && newFixture[that.ID_PROP]) {
                            id = newFixture[that.ID_PROP];
                        }

                        if (!id || !newFixture) {
                            that.throwError("Either ID not provided or newFixture not provided for PUT request!", that.opts, id, newFixture);
                        }

                        // Need to scramble data if no custom newFixture was provided
                        if (!customFixture) {
                            newFixture = _testDataHandler2.default.changeDataBasedOnType(newFixture, _this2.getIgnoreProperties());
                        }
                        break;
                    case "DELETE":
                        if (!id && _lodash2.default.isObject(newFixture) && newFixture[that.ID_PROP]) {
                            id = newFixture[that.ID_PROP];
                        }

                        if (!id) {
                            that.throwError("ID not provide for DELETE request", that.opts);
                        }
                        break;
                    case "LIST":
                        options.method = methodType = "GET";
                        break;
                }

                options.form = newFixture;

                if (options.uri.indexOf(":id") !== -1) {
                    if (!id) {
                        that.throwError("No ID provided where url requires one!", that.opts, options);
                    } else {
                        options.uri = options.uri.replace(":id", id);
                    }
                }

                if (params) {
                    options.qs = params;
                }

                if (that.isDebugging()) {
                    console.log("##################################");
                    console.log("SENDING TO SERVER");
                    console.log("OPTS: ", options);
                    console.log("##################################\n");
                }
                that.fetchData(options).then(function (response) {
                    if (that.isDebugging()) {
                        console.log("\n##################################");
                        console.log("RECEIVED FROM SERVER");
                        console.log("RESPONSE: ", response);
                        console.log("\nTEST FIXTURE: ", newFixture);
                        console.log("##################################");
                    }

                    if (that.shouldShowResponse()) {
                        console.log("RESPONSE: ", response);
                    }

                    if (callback) {
                        callback(newFixture, response);
                    }
                    done();
                }).catch(function (e) {
                    that.error = e;
                    done();
                    //that.throwServerError(options);
                });
            });

            this.Describe.it("should NOT error on " + methodType + ": " + this.getRoute(methodType), function () {
                if (that.error) {
                    that.throwServerError({ methodType: methodType, route: that.getRoute(methodType), fixture: changeFixture });
                }
                expect(that.error).to.be.null;
            });
        }
    }, {
        key: "throwServerError",
        value: function throwServerError(opts) {
            var that = this;
            that.throwError(that.error.statusCode + ": " + JSON.stringify(that.error.error), opts);
        }
    }, {
        key: "callGET",
        value: function callGET(changeFixture, callback, trimExcessArrayObjects) {
            trimExcessArrayObjects = _lodash2.default.isUndefined(trimExcessArrayObjects) ? false : true;

            var that = this;
            this.callServer("GET", changeFixture, null, function (fixture, response) {
                if (!that.getID()) {
                    that.setIDFromResponse(response);
                }
                if (!fixture) {
                    that.setFixture(response);
                    fixture = response;
                }
                response = _testDataHandler2.default.matchFixtureProperties(fixture, response, trimExcessArrayObjects);
                _testDataHandler2.default.fixValuesForComparison(fixture, response);

                if (callback) {
                    callback(fixture, response);
                }

                that.setFixture(fixture);
            });
            return this;
        }
    }, {
        key: "testGET",
        value: function testGET(changeFixture) {

            // Creating a pointer to fill in that expect tests can reference. Can't send fixture over on fn call
            // because it won't be in-sync with various edge cases.
            var testObj = {};

            this.callGET(changeFixture, function (fixture, response) {
                testObj.fixture = fixture;
                testObj.response = response;
            }, true);

            var GetDescribe = new _describeBlock2.default("GET Response Tests");

            this.expectID(GetDescribe, testObj);
            this.expectKeys(GetDescribe, testObj);
            this.expectDataTypes(GetDescribe, testObj);

            this.Describe.describe(GetDescribe);
            return this;
        }
    }, {
        key: "callPOST",
        value: function callPOST(changeFixture, callback) {
            var _this3 = this;

            var that = this;

            var allowGET = this.allowGET();

            this.callServer("POST", changeFixture, null, function (fixture, response) {
                that.setIDFromResponse(response);
                fixture[that.ID_PROP] = _this3.getID();
                if (!allowGET && callback) {
                    callback(fixture, response);
                }
                that.setFixture(fixture);
            });

            if (allowGET) {
                // Not sending changeFixture to GET because otherwise it'll run twice, which we don't want

                this.callGET(null, callback);
            }

            return this;
        }
    }, {
        key: "testPOST",
        value: function testPOST(changeFixture) {

            // Creating a pointer to fill in that expect tests can reference. Can't send fixture over on fn call
            // because it won't be in-sync with various edge cases.
            var testObj = {};

            this.callPOST(changeFixture, function (fixture, response) {
                testObj.fixture = fixture;
                testObj.response = response;
            });
            var text = "POST Test";
            if (this.allowGET()) {
                text = "POST/GET Test";
            }
            var PostDescribe = new _describeBlock2.default(text);

            this.expectID(PostDescribe, testObj);
            this.expectKeys(PostDescribe, testObj);
            this.expectDataTypes(PostDescribe, testObj);
            this.expectValueParity(PostDescribe, testObj);

            this.Describe.describe(PostDescribe);

            return this;
        }
    }, {
        key: "callPUT",
        value: function callPUT(changeFixture, callback) {
            var that = this;

            var allowGET = this.allowGET();

            this.callServer("PUT", changeFixture, null, function (fixture, response) {
                if (!allowGET && callback) {
                    callback(fixture, response);
                }
                that.setFixture(fixture);
            });

            if (allowGET) {
                // Not sending changeFixture to GET because otherwise it'll run twice, which we don't want

                this.callGET(null, callback);
            }

            return this;
        }
    }, {
        key: "testPUT",
        value: function testPUT(changeFixture) {

            // Creating a pointer to fill in that expect tests can reference. Can't send fixture over on fn call
            // because it won't be in-sync with various edge cases.
            var testObj = {};

            this.callPUT(changeFixture, function (fixture, response) {
                testObj.fixture = fixture;
                testObj.response = response;
            });

            var text = "PUT Test";
            if (this.allowGET()) {
                text = "PUT/GET Test";
            }
            var PutDescribe = new _describeBlock2.default(text);

            this.expectID(PutDescribe, testObj);
            this.expectKeys(PutDescribe, testObj);
            this.expectDataTypes(PutDescribe, testObj);
            this.expectValueParity(PutDescribe, testObj);

            this.Describe.describe(PutDescribe);

            return this;
        }
    }, {
        key: "callDELETE",
        value: function callDELETE() {
            return this;
        }
    }, {
        key: "testDELETE",
        value: function testDELETE() {

            return this;
        }

        /*
            IT TESTS
         */

    }, {
        key: "expectID",
        value: function expectID(Describe, testObj) {
            var that = this;
            Describe.it("should have ID", function () {
                expect(testObj.response[that.ID_PROP]).to.be.a("number");
            });
        }
    }, {
        key: "expectKeys",
        value: function expectKeys(Describe, testObj) {
            var that = this;
            Describe.it("should submit successfully", function () {
                expect(testObj.response).to.have.all.keys(testObj.fixture);
            });
        }
    }, {
        key: "expectDataTypes",
        value: function expectDataTypes(Describe, testObj) {
            var that = this;
            Describe.it("should have the right property types", function () {

                var serverTypes = _testDataHandler2.default.getDataTypeMap(testObj.response);
                var fixtureTypes = _testDataHandler2.default.getDataTypeMap(testObj.fixture);

                expect(serverTypes).to.eql(fixtureTypes);
            });
        }
    }, {
        key: "expectValueParity",
        value: function expectValueParity(Describe, testObj) {
            var that = this;
            Describe.it("should equal fixture values", function () {
                expect(testObj.response).to.eql(testObj.fixture);
            });
        }
    }]);

    return TestRest;
}(_abstractApiTest2.default);

exports.default = TestRest;