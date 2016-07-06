'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _dec2, _class; // jshint unused: false


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('../../ng-decorators');

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

var _testUiHarness = require('./test-ui-harness.html!text');

var _testUiHarness2 = _interopRequireDefault(_testUiHarness);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API_BASE;
/*
    !!! If you do something like this with the view, make it a directive instead.
     scope: false,
     transclude: true,
     bindToController: true,
     replace: true
*/

//start-non-standard

// If you need certain variables passed in, uncomment scope here
//scope: {}

//end-non-standard

var TestUiHarness = (_dec = (0, _ngDecorators.Component)({
    selector: 'test-ui-harness'
}), _dec2 = (0, _ngDecorators.View)({
    template: _testUiHarness2.default }), _dec(_class = _dec2(_class = function () {
    function TestUiHarness($rootScope) {
        (0, _classCallCheck3.default)(this, TestUiHarness);

        var that = this;
        API_BASE = _index2.default.config.getApiBase();
        this.responses = null;
        this.isTesting = false;
        if (_index2.default.config.isCliMode()) {
            this.isTesting = true;
        }
        $rootScope.addTestUIHarnessResponse = function (response) {
            that.addResponse(response);
        };
        //this.startWatching();
    }

    (0, _createClass3.default)(TestUiHarness, [{
        key: 'addResponse',
        value: function addResponse(response) {
            if (this.isTesting && this.watching) {
                var setResp = {};
                if (response.config) {
                    setResp.type = response.config.method;
                    setResp.url = _lodash2.default.isString(response.config.url) ? response.config.url.substr(API_BASE.length) : "";
                }
                if (response.status < 200 || response.status > 299) {
                    setResp.error = true;
                }
                if (response.data) {
                    setResp.data = response.data;
                    try {
                        setResp.data = (0, _stringify2.default)(response.data);
                    } catch (e) {}
                }
                this.responses.push(setResp);
            }
            if (this.isTesting) {
                if (response.status < 200 || response.status > 299) {
                    var message = 'Server Error. StatusCode: ' + response.status;
                    if (response.status === -1) {
                        message += ". Is the backend server enabled?";
                    }
                    throw new Error(message);
                }
            }
        }
    }, {
        key: 'startWatching',
        value: function startWatching() {
            this.responses = [];
            this.watching = true;
        }
    }, {
        key: 'stopWatching',
        value: function stopWatching() {
            this.watching = false;
        }
    }]);
    return TestUiHarness;
}()) || _class) || _class);
/* .GULP-IMPORTS-END */
exports.default = TestUiHarness;

/* .GULP-IMPORTS-START */