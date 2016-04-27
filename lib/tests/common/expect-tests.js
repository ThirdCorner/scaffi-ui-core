"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require("chai-as-promised");

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _testDataHandler = require("./test-data-handler");

var _testDataHandler2 = _interopRequireDefault(_testDataHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

function throwError(errorMsg, data) {
    console.log("============ERROR============");
    console.log("MSG: ", errorMsg);
    if (data) {
        console.log("DATA: ", data);
    }
    console.log("=============================");
    throw errorMsg;
}

var Tests = {
    ShouldNot: {
        ErrorOnAPI: function ErrorOnAPI(describe, error, opts) {
            describe.it("should NOT error on API calls", function () {
                if (error) {
                    throwError(error.statusCode + ": " + error.error, opts);
                }
                expect(error).to.be.null;
            });
        },
        ErrorOnPage: function ErrorOnPage(describe) {
            describe.it("should NOT have error'd", function () {
                expect(element(by.id('test-ui-harness')).element(by.className("error")).isPresent()).to.eventually.be.false;
            });
        }
    }

};

exports.default = Tests;