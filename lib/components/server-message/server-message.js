'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class; // jshint unused: false


var _serverMessage = require('./server-message.html!text');

var _serverMessage2 = _interopRequireDefault(_serverMessage);

var _ngDecorators = require('../../ng-decorators');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// If you need certain variables passed in, uncomment scope here
//scope: {}

//end-non-standard

/*
    !!! If you do something like this with the view, make it a directive instead.
     scope: false,
     transclude: true,
     bindToController: true,
     replace: true
*/
//start-non-standard
var ServerError = (_dec = (0, _ngDecorators.Component)({
    selector: 'server-message'
}), _dec2 = (0, _ngDecorators.View)({
    template: _serverMessage2.default }), _dec(_class = _dec2(_class = function () {
    function ServerError($rootScope, $state, $mdToast, $mdSidenav) {
        _classCallCheck(this, ServerError);

        this.$state = $state;
        this.$mdToast = $mdToast;
        this.$mdSidenav = $mdSidenav;

        var that = this;
        $rootScope.showResourceError = function (response) {
            if (response && response.status == -1 && $rootScope.getEnvironment() == "prototype") {
                return response;
            }
            return that.showInfo(response);
        };
        $rootScope.showServerError = function (response) {
            if (response && response.status == -1 && $rootScope.getEnvironment() == "prototype") {
                return response;
            }
            return that.showPopup(response);
        };
        $rootScope.showSuccessToast = function (message) {
            return that.showSuccessToast(message);
        };
        $rootScope.showErrorToast = function (message) {
            return that.showErrorToast(message);
        };
        $rootScope.hideServerPopup = function () {
            return that.hidePopup();
        };
    }

    _createClass(ServerError, [{
        key: 'dismiss',
        value: function dismiss() {
            this.hidePopup();
        }
    }, {
        key: 'showSuccessToast',
        value: function showSuccessToast(message) {
            this.$mdToast.show(this.$mdToast.simple().textContent(message).theme("success-toast").position("bottom right").hideDelay(3000));
        }
    }, {
        key: 'showErrorToast',
        value: function showErrorToast(message) {
            this.$mdToast.show(this.$mdToast.simple().textContent(message).theme("error-toast").position("bottom right").hideDelay(7000));
        }
    }, {
        key: 'showInfo',
        value: function showInfo(response) {
            //console.log("=================== INFO =================");
            //console.log(response);
            //console.log("==========================================");

            if (response && response.status != 404) {
                this.showErrorPopup(response);
            }
        }
    }, {
        key: 'showPopup',
        value: function showPopup(response) {
            if (response && response.status == 404) {
                this.$state.go("404");
                return;
            }

            this.showErrorPopup(response);
            //this.$state.go("500");
        }
    }, {
        key: 'showErrorPopup',
        value: function showErrorPopup(response) {

            this.error = {};
            _lodash2.default.each(response.data, function (value, name) {
                this.error[name] = value;

                try {
                    this.error[name] = JSON.decode(value);
                } catch (e) {}
            }, this);

            this.error.statusCode = response.status;

            var response = this.error.response ? this.error.response : null;
            try {
                response = JSON.parse(response);
            } catch (e) {}

            var preData = angular.copy(this.error);
            preData["response"] = response;

            preData = JSON.stringify(preData, true);
            this.error.pre = preData;

            this.$mdSidenav('server-error').toggle();
        }
    }, {
        key: 'hidePopup',
        value: function hidePopup() {
            var that = this;
            this.$mdSidenav('server-error').close().then(function () {
                that.error = null;
                that.$state.go(that.$state.current, {}, { reload: true });
            });
        }
    }]);

    return ServerError;
}()) || _class) || _class);
exports.default = ServerError;