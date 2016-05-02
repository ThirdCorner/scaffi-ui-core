'use strict';

import {Factory} from '../../ng-decorators'; // jshint unused: false
import _ from 'lodash';
/*
    This class is so that scaffi-ui-core components can run stuff after everything else in a project is loaded.
 */
//start-non-standard
@Factory({
	factoryName: 'postLoader'
})
//end-non-standard
class PostLoader  {
	constructor() {
		this.events = [];
	}
	add(event) {
		this.events.push(event);
	}
	
	call() {
		_.each(this.events, (event)=>{
			event()
		});
	}

	static factory() {
		PostLoader.instance = new PostLoader();
		return PostLoader.instance;
	}


}

export default PostLoader;
