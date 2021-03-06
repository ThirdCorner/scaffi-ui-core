'use strict';

import {Config, Run, Inject} from '../ng-decorators'; // jshint unused: false
import _ from 'lodash';

import ScaffiUi from '../index.js';

class OnConfig {
    //start-non-standard
    @Config()
    @Inject('$locationProvider', '$provide', '$urlRouterProvider')
    //end-non-standard
    static configFactory($locationProvider, $provide, $urlRouterProvider){
        // overwrite the default behaviour for $uiViewScroll service (scroll to top of the page)
        $provide.decorator('$uiViewScroll', ['$delegate', '$window', function ($delegate, $window) {
            return function () {
                $window.scrollTo(0,0);
            };
        }]);

        if(ScaffiUi.config.isWebPlatform()) {
    
            /*********************************************************************
             * Route provider configuration based on these config constant values
             *********************************************************************/
            
            // use the HTML5 History API
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
    
            // for any unmatched url, send to 404 page (Not page found)
            $urlRouterProvider.otherwise('/404');
        } else {
            $locationProvider.html5Mode(false); // disable html5 mode on mobile devices.
        }

    }
}

class OnRun {
    //start-non-standard
    @Run()
    @Inject('$rootScope', '$state', '$log')
    //end-non-standard
    static runFactory($rootScope, $state, $log, StateStore){
	    /*
	        Set up fn to say if we're testing or not
	     */
	    console.log(StateStore)

		/*
			Declare custom rootScope fns
		 */
	    
        $rootScope.$on('$stateChangeStart', (event, toState) => {
            //console.log(event);
            //console.log(toState);
        });
        $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
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
        $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
            event.preventDefault();
            $log.error(error.stack);
            $state.go('500');
        });
    }
}

export {OnConfig, OnRun};
