'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Factory = exports.Directive = exports.Filter = exports.Service = exports.Config = exports.Run = exports.Inject = exports.RouteConfig = exports.View = exports.Component = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _angular2.default.module('app', []);

// Adds redirectTo Capabilities in the route config
app.run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (evt, to, params) {
        if (to.redirectTo) {
            evt.preventDefault();
            $state.go(to.redirectTo, params);
        }
    });
});

function Run() {
    return function decorator(target, key, descriptor) {
        app.run(descriptor.value);
    };
}

function Config() {
    return function decorator(target, key, descriptor) {
        app.config(descriptor.value);
    };
}
function Factory(options) {
    return function decorator(target) {
        options = options ? options : {};
        if (!options.factoryName) {
            throw new Error('@Factory() must contains factoryName property!');
        }
        app.factory(options.factoryName, target.factory);
    };
}
function Service(options) {
    return function decorator(target) {
        options = options ? options : {};
        if (!options.serviceName) {
            throw new Error('@Service() must contains serviceName property!');
        }
        app.service(options.serviceName, target);
    };
}

function Filter(filter) {
    return function decorator(target, key, descriptor) {
        filter = filter ? filter : {};
        if (!filter.filterName) {
            throw new Error('@Filter() must contains filterName property!');
        }
        app.filter(filter.filterName, descriptor.value);
    };
}

function Inject() {
    for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
        dependencies[_key] = arguments[_key];
    }

    return function decorator(target, key, descriptor) {
        // if it's true then we injecting dependencies into function and not Class constructor
        if (descriptor) {
            var fn = descriptor.value;
            fn.$inject = dependencies;
        } else {
            target.$inject = dependencies;
        }
    };
}

function Component(component) {
    return function decorator(target) {
        component = component ? component : {};
        if (!component.selector) {
            throw new Error('@Component() must contains selector property!');
        }

        if (target.$initView) {
            target.$initView(component.selector);
        }

        target.$isComponent = true;
    };
}

function View(view) {
    var options = view ? view : {};
    var defaults = {
        template: options.template,
        restrict: 'E',
        scope: {},
        bindToController: true,
        controllerAs: 'vm',
        link: function link(scope, element, attrs) {
            if (attrs.required && !scope.hasOwnProperty("required")) {
                scope.required = true;
            }
        }

    };
    return function decorator(target) {
        if (target.$isComponent) {
            throw new Error('@View() must be placed after @Component()!');
        }

        target.$initView = function (directiveName) {
            directiveName = pascalCaseToCamelCase(directiveName);
            directiveName = dashCaseToCamelCase(directiveName);

            options.bindToController = options.bindToController || options.bind || {};

            app.directive(directiveName, function () {
                /*
                 So we can have access to config for switching out mobile templates
                 */
                var ScaffiCore = require("./index").default;
                if (options.mobileTemplate && ScaffiCore.config.isMobilePlatform()) {
                    options.template = options.mobileTemplate;
                }

                return (0, _extends3.default)(defaults, { controller: target }, options);
            });
        };

        target.$isView = true;
    };
}

function Directive(options) {
    return function decorator(target) {
        var directiveName = dashCaseToCamelCase(options.selector);
        app.directive(directiveName, target.directiveFactory);
    };
}

function RouteConfig(stateName, options) {

    return function decorator(target) {

        app.config(['$stateProvider', function ($stateProvider) {
            /*
             So we can have access to config for switching out mobile templates
             */
            var ScaffiCore = require("./index").default;
            if (ScaffiCore.config.isMobilePlatform()) {
                if (options.template == "<ui-view></ui-view>") {
                    options.template = "<ion-nav-view></ion-nav-view>";
                } else if (options.mobileTemplate) {
                    options.template = options.mobileTemplate;
                }
            }

            $stateProvider.state(stateName, (0, _extends3.default)({
                controller: target,
                controllerAs: 'vm'
            }, options));
        }]);
        app.controller(target.name, target);
    };
}

// Utils functions
function pascalCaseToCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
}

function dashCaseToCamelCase(string) {
    return string.replace(/-([a-z])/ig, function (all, letter) {
        return letter.toUpperCase();
    });
}

exports.default = app;
exports.Component = Component;
exports.View = View;
exports.RouteConfig = RouteConfig;
exports.Inject = Inject;
exports.Run = Run;
exports.Config = Config;
exports.Service = Service;
exports.Filter = Filter;
exports.Directive = Directive;
exports.Factory = Factory;