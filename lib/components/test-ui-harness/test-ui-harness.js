'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class; // jshint unused: false


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('../../ng-decorators');

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

var _testUiHarness = require('./test-ui-harness.html!text');

var _testUiHarness2 = _interopRequireDefault(_testUiHarness);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        _classCallCheck(this, TestUiHarness);

        var that = this;
        API_BASE = _index2.default.config.getApiBase();
        this.responses = null;
        this.isTesting = false;
        if ($rootScope.getEnvironment() == "test") {
            this.isTesting = true;
        }
        $rootScope.addTestUIHarnessResponse = function (response) {
            that.addResponse(response);
        };
        //this.startWatching();
    }

    _createClass(TestUiHarness, [{
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
                        setResp.data = JSON.stringify(response.data);
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