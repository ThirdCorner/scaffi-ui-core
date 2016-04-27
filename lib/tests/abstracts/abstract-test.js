'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _describeBlock = require('../common/describe-block');

var _describeBlock2 = _interopRequireDefault(_describeBlock);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractTest = function () {
    function AbstractTest() {
        _classCallCheck(this, AbstractTest);
    }

    _createClass(AbstractTest, [{
        key: 'isDebugging',
        value: function isDebugging() {
            return this.debugEnabled;
        }
    }, {
        key: 'enableDebugging',
        value: function enableDebugging() {
            this.debugEnabled = true;
        }
    }, {
        key: 'disableDebugging',
        value: function disableDebugging() {
            this.debugEnabled = false;
        }

        /*
            Test-specific fns
         */

    }, {
        key: 'addTest',
        value: function addTest(describeBlock) {
            if (!_lodash2.default.isArray(this.tests)) {
                this.tests = [];
            }
            this.tests.push(describeBlock);
        }
    }, {
        key: 'getTests',
        value: function getTests() {
            if (!_lodash2.default.isArray(this.tests)) {
                this.tests = [];
            }
            return this.tests;
        }
    }, {
        key: 'newSuite',
        value: function newSuite(describeText) {
            this.Describe = new _describeBlock2.default(describeText);
            this.tests = [];
        }
    }, {
        key: 'outputTests',
        value: function outputTests() {
            if (!_lodash2.default.isArray(this.tests)) {
                this.tests = [];
            }
            if (this.tests.length == 0) {
                this.throwError("No test--s provided!");
                return;
            }
            _lodash2.default.each(this.tests, function (test) {
                test.output();
            }, this);

            this.tests = [];
        }

        /*
            Utility fns
         */

    }, {
        key: 'copy',
        value: function copy(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }, {
        key: 'throwError',
        value: function throwError(errorMsg, data) {
            console.log("============ERROR============");
            console.log("MSG: ", errorMsg);

            var args = [];
            _lodash2.default.each(arguments, function (value) {
                args.push(value);
            });
            args.shift();

            _lodash2.default.each(args, function (value) {
                console.log("DATA: ", value);
            });

            console.log("=============================");
            throw errorMsg;
        }
    }]);

    return AbstractTest;
}();

exports.default = AbstractTest;