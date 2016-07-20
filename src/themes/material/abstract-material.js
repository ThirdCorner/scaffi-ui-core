'use strict';

import _ from 'lodash';
import AbstractTheme from '../classes/abstract-theme';

class AbstractMaterial extends AbstractTheme {
	constructor(args){
		super(args);
		
		this.addRequires([
			'angular-loading-bar'
		]);
		this.getApp().config( (cfpLoadingBarProvider)=>{
			cfpLoadingBarProvider.includeBar = true;
			cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
			cfpLoadingBarProvider.includeSpinner = false;
		});
	}
}