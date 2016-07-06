/*
	This is to be loaded after all other routes so we can intercept mock routes that aren't declared.
 */

'use strict';

import {Run} from '../ng-decorators';
import ScaffiCore from '../index';

class MockHttpFallthrough {
	//start-non-standard
	@Run()
	//end-non-standard
	runFactory($httpBackend, postLoader){
		if(!ScaffiCore.config.isPrototypeMode()) {
			return false;
		}
		/*
		 Full stop passthrough
		 */
		
		postLoader.add(function(){
			$httpBackend.whenGET(/^\/api\/.*/).respond((method, url, data, headers) => {
				console.log("==========================");
				console.log("   MOCK API FALLTHROUGH   ");
				headers['Content-Type'] = 'application/json;version=1';
				console.log(url)
				throw new Error("No API Service call for " + url + " declared!"); 
				return [404];
	
			});
			$httpBackend.whenGET(/^\w+.*/).passThrough();
			$httpBackend.whenPOST(/^\w+.*/).passThrough();
		});

	}
}


export default MockHttpFallthrough;
