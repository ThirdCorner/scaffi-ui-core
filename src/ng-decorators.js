'use strict';

import angular from 'angular';

const app = angular.module('app', []);

// Adds redirectTo Capabilities in the route config
app.run(($rootScope, $state) => {
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
        if (to.redirectTo) {
            evt.preventDefault();
            $state.go(to.redirectTo, params)
        }
    });
})

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
    }
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

function Inject(...dependencies) {
    return function decorator(target, key, descriptor) {
        // if it's true then we injecting dependencies into function and not Class constructor
        if(descriptor) {
            const fn = descriptor.value;
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
    let options = view ? view : {};
    const defaults = {
        template: options.template,
        restrict: 'E',
        scope: {},
        bindToController: true,
        controllerAs: 'vm',
        link: (scope, element, attrs) => {
            if(attrs.required && !scope.hasOwnProperty("required")) {
                scope.required = true;
            }
        }

    };
    return function decorator(target) {
        if (target.$isComponent) {
            throw new Error('@View() must be placed after @Component()!');
        }

        target.$initView = function(directiveName) {
            directiveName = pascalCaseToCamelCase(directiveName);
            directiveName = dashCaseToCamelCase(directiveName);

            options.bindToController = options.bindToController || options.bind || {};

            app.directive(directiveName, function () {
                /*
                 So we can have access to config for switching out mobile templates
                 */
                var ScaffiCore = require("./index").default;
                if(options.mobileTemplate && ScaffiCore.config.isMobilePlatform()) {
                    options.template = options.mobileTemplate;
                }

                return Object.assign(defaults, { controller: target }, options);
            });
        };

        target.$isView = true;
    };
}

function Directive(options) {
    return function decorator(target) {
        const directiveName = dashCaseToCamelCase(options.selector);
        app.directive(directiveName, target.directiveFactory);
    };
}

function RouteConfig(stateName, options) {

    return function decorator(target) {
       

        app.config(['$stateProvider', ($stateProvider) => {
            /*
             So we can have access to config for switching out mobile templates
             */
            var ScaffiCore = require("./index").default;
            if(ScaffiCore.config.isMobilePlatform()) {
                if(options.template == "<ui-view></ui-view>") {
                    options.template = "<ion-nav-view></ion-nav-view>";
                } else if(options.mobileTemplate) {
                    options.template = options.mobileTemplate;
                }
            }
            
            $stateProvider.state(stateName, Object.assign({
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
    return string.replace( /-([a-z])/ig, function( all, letter ) {
        return letter.toUpperCase();
    });
}

export default app;
export {Component, View, RouteConfig, Inject, Run, Config, Service, Filter, Directive, Factory};
