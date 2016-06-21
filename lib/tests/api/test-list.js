"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

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

var _testRest = require("./test-rest");

var _testRest2 = _interopRequireDefault(_testRest);

var _describeBlock = require("../common/describe-block");

var _describeBlock2 = _interopRequireDefault(_describeBlock);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

var TestList = function (_TestRest) {
    (0, _inherits3.default)(TestList, _TestRest);

    function TestList() {
        (0, _classCallCheck3.default)(this, TestList);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TestList).apply(this, arguments));
    }

    (0, _createClass3.default)(TestList, [{
        key: "ensureListHasTestableStructures",
        value: function ensureListHasTestableStructures(opts) {
            if (!this.ensureTableStructure) {
                var that = this;

                this.callLIST(null, this.makeFilterParam(opts, {}), function (fixture, response) {
                    var limit = opts.count || 3;
                    if (!_lodash2.default.isObject(response) || !_lodash2.default.has(response, "results") || !_lodash2.default.has(response, "inlineCount")) {
                        that.throwError("LIST response must be an object with count and results defined as properties!", response);
                    }
                    if (!response.results || response.results.length < limit && !that.allowPOST()) {
                        that.throwError("LIST results is less than " + limit + " and can't POST! Need more data.", response);
                    }
                    if (!response.results.length && !opts.fixture) {
                        that.throwError("LIST isn't returning any results and no fixture is declared for insertion", response);
                    }

                    if (response.results.length < limit) {
                        for (var i = response.results.length; i <= limit; i++) {
                            var fixture = opts.fixture || response.results[0];
                            that.callPOST(fixture);
                        }
                    }
                });
                this.ensureTableStructure = true;
            }
        }
    }, {
        key: "ensureSeedData",
        value: function ensureSeedData(opts, fixture, getOptsColumns) {
            var that = this;
            if (!_lodash2.default.isObject(getOptsColumns)) {
                this.throwError("testFilter in LIST tests must be an object mapping filter name to actual object property", opts);
            }
            if (!fixture) {
                this.throwError("You must provide a fixture so that testFilter can figure out data types", opts);
            }

            var testFixture = this.copy(fixture);
            _lodash2.default.each(getOptsColumns, function (columnName, filterName) {

                if (columnName == that.ID_PROP) {
                    return;
                }
                if (!_lodash2.default.has(testFixture, columnName)) {
                    that.throwError("testLIST filter does not have LIST fixture column " + columnName, testFixture);
                }
                if (_lodash2.default.isNull(testFixture[columnName])) {
                    that.throwError("testList filter column '" + columnName + "' value in fixture is null. Can't properly test without value!", testFixture);
                }

                testFixture[columnName] = _testDataHandler2.default.changeValueBasedOnType(testFixture[columnName]);
            });
            if (this.allowPOST()) {
                this.callPOST(testFixture, function (fixture, response) {
                    that.ensureLockedValuesTransfer(testFixture, response);
                });
            } else if (this.allowPUT()) {
                this.callPUT(testFixture, function (fixture, response) {
                    that.ensureLockedValuesTransfer(testFixture, response);
                });
            } else {
                this.throwError("Could not plant seed data for testLIST testFilter because POST and PUT is disabled.", opts);
            }

            return testFixture;
        }
    }, {
        key: "ensureLockedValuesTransfer",
        value: function ensureLockedValuesTransfer(fixture, response) {
            var lockedColumns = [this.ID_PROP, "CreatedOn", "CreatedDate", "ModifiedOn", "ModifiedDate"];
            _lodash2.default.each(lockedColumns, function (colName) {
                if (_lodash2.default.has(response, colName)) {
                    fixture[colName] = response[colName];
                }
            }, this);
        }
    }, {
        key: "callLIST",
        value: function callLIST(changeFixture, params, callback) {
            var that = this;

            this.callServer("LIST", changeFixture, params, function (fixture, response) {

                if (callback) {
                    callback(fixture, response);
                }
            });

            return this;
        }
    }, {
        key: "makeFilterParam",
        value: function makeFilterParam(opts, param) {
            if (opts.filter) {
                _lodash2.default.each(opts.filter, function (value, key) {
                    param[key] = value;
                }, this);
            }
            this.makeParam(opts, param);

            return param;
        }
    }, {
        key: "makeParam",
        value: function makeParam(opts, param) {
            // Setting a default count and page because that's what the table component always sends
            if (!_lodash2.default.has(param, "count")) {
                param.count = 99;
            }
            if (!_lodash2.default.has(param, "page")) {
                param.page = 1;
            }
            return param;
        }
    }, {
        key: "testLIST",
        value: function testLIST(opts) {
            var _this2 = this;

            if (opts.debug) {
                this.enableDebugging();
            }
            var that = this;
            var Describe = new _describeBlock2.default("LIST Tests");

            this.ensureListHasTestableStructures(opts);
            var limit = opts.count || 2;

            if (opts.testCount) {

                var CountDescribe = new _describeBlock2.default("Test param: count");

                var testCount = {};

                this.callLIST(null, this.makeFilterParam(opts, { count: 2 }), function (fixture, response) {
                    testCount.response = response;
                });

                that.expectCountToFilter(CountDescribe, 2, testCount);
                Describe.describe(CountDescribe);
            }
            if (opts.testPagination) {
                if (!opts.testCount && !opts.count) {
                    this.throwError("You either need to allow count testing or provide a count property that the server is set for! EX: count: 20", opts);
                }

                var PageDescribe = new _describeBlock2.default("Test param: page");

                var testPageObj = {};

                this.callLIST(null, this.makeFilterParam(opts, { count: limit }), function (fixture, response) {
                    testPageObj.responsePageOne = response;
                });

                this.callLIST(null, this.makeFilterParam(opts, { count: limit, page: 2 }), function (fixture, response) {
                    testPageObj.responsePageTwo = response;
                });

                that.expectDifferentResponses(PageDescribe, testPageObj);
                Describe.describe(PageDescribe);
            }
            if (opts.testFilter) {
                var testFixture = this.ensureSeedData(opts, opts.fixture, opts.testFilter);
                var testFilterObj = { seedFixture: testFixture };

                // For PStar, you have to provide a filter so we can't test the count
                //this.callLIST(null, this.makeFilterParam(opts, {}), (fixture, response)=>{
                //   testFilterObj.initialCount = response.results.length;
                //
                //});

                _lodash2.default.each(opts.testFilter, function (columnName, filterName) {

                    var seedValue = testFixture[columnName];
                    var TestFilterDescribe = new _describeBlock2.default("Testing param: filter/" + columnName);
                    that.callLIST(null, _this2.makeParam(opts, (0, _defineProperty3.default)({}, filterName, seedValue)), function (fixture, response) {
                        testFilterObj[filterName] = response;
                    });
                    that.expectResultsToFilter(TestFilterDescribe, filterName, columnName, testFilterObj);

                    Describe.describe(TestFilterDescribe);
                }, this);
            }
            if (opts.testSorting) {
                var testSortFilterObj = { seedFixture: this.ensureSeedData(opts, opts.fixture, opts.testSorting) };

                _lodash2.default.each(opts.testSorting, function (columnName, sortName) {

                    var TestSortDescribe = new _describeBlock2.default("Testing param: sort/" + columnName);
                    that.callLIST(null, _this2.makeFilterParam(opts, { sortProperty: columnName, sortDirection: "asc" }), function (fixture, response) {
                        testSortFilterObj[sortName] = {
                            "asc": response
                        };
                    });
                    that.callLIST(null, _this2.makeFilterParam(opts, { sortProperty: columnName, sortDirection: "desc" }), function (fixture, response) {
                        testSortFilterObj[sortName]["desc"] = response;
                    });
                    that.expectResultsToSort(TestSortDescribe, sortName, testSortFilterObj);

                    Describe.describe(TestSortDescribe);
                }, this);
            }

            this.Describe.describe(Describe);
            return this;
        }
    }, {
        key: "expectCountToFilter",
        value: function expectCountToFilter(Describe, pageLimit, testObj) {
            var that = this;
            Describe.it("should have inlineCount != " + pageLimit, function () {
                expect(testObj.response.inlineCount).to.not.equal(pageLimit);
            });
            Describe.it("should have " + pageLimit + " LIST results", function () {
                expect(testObj.response.results).to.have.length(pageLimit);
            });
            Describe.it("should limit results to inlineCount", function () {
                expect(testObj.response.inlineCount).to.be.a("number");
                expect(testObj.response.results).to.be.a("array");
                expect(testObj.response.results).to.have.length.below(testObj.response.inlineCount);
            });
            Describe.it("results should equal filter limit count", function () {
                expect(testObj.response.results).to.have.length(pageLimit);
            });
        }
    }, {
        key: "expectDifferentResponses",
        value: function expectDifferentResponses(Describe, testObj) {
            var that = this;
            Describe.it("page1 should have LIST response and results", function () {
                expect(testObj.responsePageOne).to.have.property("inlineCount");
                expect(testObj.responsePageOne).to.have.property("results");
                expect(testObj.responsePageOne.results).to.have.length.above(0);
            });
            Describe.it("page2 should have LIST response and results", function () {
                expect(testObj.responsePageTwo).to.have.property("inlineCount");
                expect(testObj.responsePageTwo).to.have.property("results");
                expect(testObj.responsePageTwo.results).to.have.length.above(0);
            });
            Describe.it("should have page result IDs that don't match", function () {
                var page1ID = testObj.responsePageOne.results[0][that.ID_PROP];
                var page2ID = testObj.responsePageTwo.results[0][that.ID_PROP];
                expect(page1ID).to.be.a("number");
                expect(page2ID).to.be.a("number");
                expect(page1ID).to.not.equal(page2ID);
            });
        }
    }, {
        key: "expectResultsToFilter",
        value: function expectResultsToFilter(Describe, filterName, columnName, testObj) {
            var _this3 = this;

            var that = this;

            Describe.it("filter: " + filterName + " should have results", function () {
                expect(testObj[filterName].results).to.have.length.above(0);
            });
            //Describe.it(`filter: ${filterName} results should be less than initial call`, ()=>{
            //   expect(testObj[filterName].results).to.have.length.below(testObj.initialCount);
            //});
            Describe.it("filter: " + filterName + " results should have seed value", function () {
                var testValue = testObj.seedFixture[columnName];
                _lodash2.default.each(testObj[filterName].results, function (result) {
                    var checkValue = _testDataHandler2.default.fixValueStructure(testValue, result[columnName]);
                    expect(checkValue).to.equal(testValue);
                }, _this3);
            });
        }
    }, {
        key: "expectResultsToSort",
        value: function expectResultsToSort(Describe, sortProperty, testObj) {
            var that = this;

            Describe.it("sort: " + sortProperty + " asc should have results", function () {
                expect(testObj[sortProperty]["asc"].results).to.have.length.above(0);
            });
            Describe.it("sort: " + sortProperty + " desc should have results", function () {
                expect(testObj[sortProperty]["desc"].results).to.have.length.above(0);
            });
            Describe.it("sort: " + sortProperty + " asc/desc top row should be different via the ID", function () {
                var ascID = testObj[sortProperty]["asc"].results[0][that.ID_PROP];
                var descID = testObj[sortProperty]["desc"].results[0][that.ID_PROP];

                expect(descID).to.not.equal(ascID);
            });
        }
    }]);
    return TestList;
}(_testRest2.default);

exports.default = TestList;