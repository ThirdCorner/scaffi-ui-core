'use strict';

import {Directive} from '../../ng-decorators'; // jshint unused: false;
//start-non-standard
@Directive({
    selector: 'state-change'
})
//end-non-standard
class StateChange {
    constructor($rootScope, $state){
        this.restrict = 'A';
        this.scope = {
            stateChange: "&"
        };


    }

    link(scope, element, attrs, ngModel){


        var that = this;

        var stateChangFn = scope.stateChange();

        var rootListener = scope.$root.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                    stateChangFn(toState.name);
            });
        scope.$on("$destroy", ()=>{
            rootListener();
        });
    }

    static directiveFactory($rootScope, $state){
        StateChange.instance = new StateChange($rootScope, $state);
        return StateChange.instance;
    }
}

export default StateChange;

