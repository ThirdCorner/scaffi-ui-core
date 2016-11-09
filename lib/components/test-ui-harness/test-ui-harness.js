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

var _responseLogger = require('../../classes/response-logger');

var _responseLogger2 = _interopRequireDefault(_responseLogger);

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

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
    template: template }), _dec(_class = _dec2(_class = function () {
    function TestUiHarness($rootScope) {
        (0, _classCallCheck3.default)(this, TestUiHarness);

        var that = this;
        API_BASE = _index2.default.config.getApiBase();
        this.responses = null;
        this.isTesting = false;
        if (_index2.default.config.isCiMode()) {
            this.isTesting = true;
            _responseLogger2.default.onResponse(function (event) {
                that.addResponse(event.response);
            });
        }
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
exports.default = TestUiHarness;

/* .GULP-IMPORTS-START */
var template = '<div id="test-ui-harness" style="position: fixed; top: 0; left: 0; max-height: 50px; width: 300px; overflow-y: scroll; z-index: 100000;" ng-class="{hidden: vm.isTesting === false}">\r\n    <button id="start-test-exchange-recording" ng-click="vm.startWatching()">R</button>\r\n    <button id="stop-test-exchange-recording" ng-click="vm.stopWatching()">S</button>\r\n    <div class="request {{\'type-\' + response.type}}" style="overflow: scroll; display: inline-block;" ng-class="{error: response.error}" ng-repeat="response in vm.responses">\r\n        <span class="type">{{response.type}}</span>\r\n        <span class="request-url">{{response.url}}</span>\r\n        <span class="response">{{response.data}}</span>\r\n    </div>\r\n</div>'; /* .GULP-IMPORTS-END */