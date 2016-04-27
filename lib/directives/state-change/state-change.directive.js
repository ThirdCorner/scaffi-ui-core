'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _ngDecorators = require('../../ng-decorators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//end-non-standard
// jshint unused: false;
//start-non-standard
var StateChange = (_dec = (0, _ngDecorators.Directive)({
    selector: 'state-change'
}), _dec(_class = function () {
    function StateChange($rootScope, $state) {
        _classCallCheck(this, StateChange);

        this.restrict = 'A';
        this.scope = {
            stateChange: "&"
        };
    }

    _createClass(StateChange, [{
        key: 'link',
        value: function link(scope, element, attrs, ngModel) {

            var that = this;

            var stateChangFn = scope.stateChange();

            var rootListener = scope.$root.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                stateChangFn(toState.name);
            });
            scope.$on("$destroy", function () {
                rootListener();
            });
        }
    }], [{
        key: 'directiveFactory',
        value: function directiveFactory($rootScope, $state) {
            StateChange.instance = new StateChange($rootScope, $state);
            return StateChange.instance;
        }
    }]);

    return StateChange;
}()) || _class);
exports.default = StateChange;