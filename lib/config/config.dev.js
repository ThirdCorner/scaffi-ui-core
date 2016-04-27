'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class, _dec2, _desc2, _value2, _class2; // jshint unused: false


require('angular-mocks');

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

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

var OnConfigDev = (_dec = (0, _ngDecorators.Config)(), (_class = function () {
    function OnConfigDev() {
        _classCallCheck(this, OnConfigDev);
    }

    _createClass(OnConfigDev, null, [{
        key: 'configFactory',

        //end-non-standard
        value: function configFactory($provide) {
            if (_index2.default.config.getEnvironment() == "dev") {
                console.log("config dev");
            }
        }
    }]);

    return OnConfigDev;
}(), (_applyDecoratedDescriptor(_class, 'configFactory', [_dec], Object.getOwnPropertyDescriptor(_class, 'configFactory'), _class)), _class));
var OnRunDev = (_dec2 = (0, _ngDecorators.Run)(), (_class2 = function () {
    function OnRunDev() {
        _classCallCheck(this, OnRunDev);
    }

    _createClass(OnRunDev, null, [{
        key: 'runFactory',

        //end-non-standard
        value: function runFactory($rootScope) {
            if (_index2.default.config.getEnvironment() == "dev") {
                $rootScope.ENV = "dev";
            }
        }
    }]);

    return OnRunDev;
}(), (_applyDecoratedDescriptor(_class2, 'runFactory', [_dec2], Object.getOwnPropertyDescriptor(_class2, 'runFactory'), _class2)), _class2));