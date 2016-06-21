'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class;

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//end-non-standard
// jshint unused: false;
//start-non-standard
var StateChange = (_dec = (0, _ngDecorators.Directive)({
    selector: 'state-change'
}), _dec(_class = function () {
    function StateChange($rootScope, $state) {
        (0, _classCallCheck3.default)(this, StateChange);

        this.restrict = 'A';
        this.scope = {
            stateChange: "&"
        };
    }

    (0, _createClass3.default)(StateChange, [{
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