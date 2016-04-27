'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OnRun = exports.OnConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _desc, _value, _class, _dec3, _dec4, _desc2, _value2, _class2; // jshint unused: false
//import routeMap from 'app/routes/routes.map.json!json';


var _ngDecorators = require('../ng-decorators');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

var OnConfig = (_dec = (0, _ngDecorators.Config)(), _dec2 = (0, _ngDecorators.Inject)('$locationProvider', '$provide', '$urlRouterProvider'), (_class = function () {
    function OnConfig() {
        _classCallCheck(this, OnConfig);
    }

    _createClass(OnConfig, null, [{
        key: 'configFactory',

        //end-non-standard
        value: function configFactory($locationProvider, $provide, $urlRouterProvider) {
            // overwrite the default behaviour for $uiViewScroll service (scroll to top of the page)
            $provide.decorator('$uiViewScroll', ['$delegate', '$window', function ($delegate, $window) {
                return function () {
                    $window.scrollTo(0, 0);
                };
            }]);

            /*********************************************************************
             * Route provider configuration based on these config constant values
             *********************************************************************/
            0;
            // use the HTML5 History API
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            // for any unmatched url, send to 404 page (Not page found)
            $urlRouterProvider.otherwise('/404');
        }
    }]);

    return OnConfig;
}(), (_applyDecoratedDescriptor(_class, 'configFactory', [_dec, _dec2], Object.getOwnPropertyDescriptor(_class, 'configFactory'), _class)), _class));
var OnRun = (_dec3 = (0, _ngDecorators.Run)(), _dec4 = (0, _ngDecorators.Inject)('$rootScope', '$state', '$log'), (_class2 = function () {
    function OnRun() {
        _classCallCheck(this, OnRun);
    }

    _createClass(OnRun, null, [{
        key: 'runFactory',

        //end-non-standard
        value: function runFactory($rootScope, $state, $log, StateStore) {
            /*
                Set up fn to say if we're testing or not
             */
            console.log(StateStore);

            $rootScope.getEnvironment = function () {
                return $rootScope.ENV || "";
            };
            /*
            	Declare custom rootScope fns
             */
            $rootScope.getRouteMap = function () {
                return null;
                return routeMap;
            };

            $rootScope.$on('$stateChangeStart', function (event, toState) {
                //console.log(event);
                //console.log(toState);
            });
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                //console.log('$stateChangeError - fired when an error occurs during transition.');
                //console.log(error);
            });

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                //console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
            });

            $rootScope.$on('$viewContentLoaded', function (event) {
                event.preventDefault();
                //console.log('$viewContentLoaded - fired after dom rendered', event);
            });

            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                //console.log('$stateNotFound ' + unfoundState.to + ' - fired when a state cannot be found by its name.');
                //console.log(unfoundState, fromState, fromParams);
            });
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                event.preventDefault();
                $log.error(error.stack);
                $state.go('500');
            });
        }
    }]);

    return OnRun;
}(), (_applyDecoratedDescriptor(_class2, 'runFactory', [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2, 'runFactory'), _class2)), _class2));
exports.OnConfig = OnConfig;
exports.OnRun = OnRun;