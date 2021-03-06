"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DescribeBlock = function () {
    function DescribeBlock(describe) {
        (0, _classCallCheck3.default)(this, DescribeBlock);

        this.text = describe || null;
        this.itBlock = [];
        this.beforeBlock = [];
        this.describeBlock = [];
        this.afterBlock = [];
    }

    (0, _createClass3.default)(DescribeBlock, [{
        key: "beforeAll",
        value: function beforeAll(fn) {
            this.beforeBlock.unshift({ fn: fn });
        }
    }, {
        key: "before",
        value: function before(fn) {
            this.beforeBlock.push({ fn: fn });
        }
    }, {
        key: "it",
        value: function it(text, fn) {
            if (!text || !fn) {
                throw new Error("You need to provide text and a callback when declaring a DescribeBlock.it nest.");
            }
            this.itBlock.push({ text: text, fn: fn });
        }
    }, {
        key: "describe",
        value: function describe(describeClass) {
            this.describeBlock.push({ fn: describeClass });
        }
    }, {
        key: "after",
        value: function after(callFn) {
            this.afterBlock.push({ fn: callFn });
        }
    }, {
        key: "getText",
        value: function getText() {
            return this.text;
        }
    }, {
        key: "getDescribes",
        value: function getDescribes() {
            return this.describeBlock;
        }
    }, {
        key: "output",
        value: function output(text) {
            var that = this;
            if (this.text) {
                text = this.text;
            }

            if (text) {
                describe(text, function () {
                    that._outputChildren();
                });
            } else {
                that._outputChildren();
            }
        }
    }, {
        key: "_outputChildren",
        value: function _outputChildren() {
            if (this.beforeBlock) {
                _lodash2.default.each(this.beforeBlock, function (beforeObj) {
                    before(beforeObj.fn);
                }, this);
            }
            if (this.itBlock) {
                _lodash2.default.each(this.itBlock, function (itObj) {
                    it(itObj.text, itObj.fn);
                }, this);
            }
            if (this.describeBlock) {
                _lodash2.default.each(this.describeBlock, function (describeObj) {
                    if (!_lodash2.default.isFunction(describeObj.fn.output)) {
                        throw "You must provide a DescribeBlock class for entry: " + describeObj.text;
                    }
                    describeObj.fn.output(describeObj.fn.text);
                }, this);
            }
            if (this.afterBlock) {
                _lodash2.default.each(this.afterBlock, function (afterObj) {
                    after(afterObj.fn);
                });
            }
        }
    }]);
    return DescribeBlock;
}();

exports.default = DescribeBlock;