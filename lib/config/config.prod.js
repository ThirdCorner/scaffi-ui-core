'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OnRunProd = exports.OnConfigProd = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _desc, _value, _class, _dec3, _dec4, _desc2, _value2, _class2; // jshint unused: false


var _ngDecorators = require('../ng-decorators');

var _index = require('../index.js');

var _index2 = _interopRequireDefault(_index);

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

var OnConfigProd = (_dec = (0, _ngDecorators.Config)(), _dec2 = (0, _ngDecorators.Inject)('$compileProvider', '$httpProvider'), (_class = function () {
    function OnConfigProd() {
        _classCallCheck(this, OnConfigProd);
    }

    _createClass(OnConfigProd, null, [{
        key: 'configFactory',

        //end-non-standard
        value: function configFactory($compileProvider, $httpProvider) {
            if (_index2.default.config.getEnvironment() == "prod") {
                // disabling debug data to get better performance gain in production
                $compileProvider.debugInfoEnabled(false);
                // configure $http service to combine processing of multiple http responses received at
                // around the same time via $rootScope.$applyAsync to get better performance gain in production
                $httpProvider.useApplyAsync(true);
            }
        }
    }]);

    return OnConfigProd;
}(), (_applyDecoratedDescriptor(_class, 'configFactory', [_dec, _dec2], Object.getOwnPropertyDescriptor(_class, 'configFactory'), _class)), _class));
var OnRunProd = (_dec3 = (0, _ngDecorators.Run)(), _dec4 = (0, _ngDecorators.Inject)('$rootScope'), (_class2 = function () {
    function OnRunProd() {
        _classCallCheck(this, OnRunProd);
    }

    _createClass(OnRunProd, null, [{
        key: 'runFactory',

        //end-non-standard
        value: function runFactory($rootScope) {
            if (_index2.default.config.getEnvironment() == "prod") {
                $rootScope.ENV = "prod";
            }
        }
    }]);

    return OnRunProd;
}(), (_applyDecoratedDescriptor(_class2, 'runFactory', [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2, 'runFactory'), _class2)), _class2));
exports.OnConfigProd = OnConfigProd;
exports.OnRunProd = OnRunProd;