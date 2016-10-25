'use strict';

import _ from 'lodash';
import path from 'path';

import ScaffiCore from '../../index';

export default {
	getBaseUrl(){
		return ScaffiCore.config.getApiBase();
	},

	getCurrentUrl(){
		return browser.getCurrentUrl();
	},
	getConsoleErrors(){
		return browser.manage().logs().get('browser').then(function(browserLog) {
			var errors = [];
			_.each(browserLog, log => {
				if (log.level.name === "WARNING" || log.level.name === "ERROR") {
					errors.push(log);
				}
			}, this);
			return errors;
		});
	},
	hasConsoleErrors(){
		return this.getConsoleErrors().then(errors =>{
			return errors.length > 0 ?  true : false;
		});
	},
	element(searchElm){
		return browser.findElement(searchElm);
	},
	_parseDynamicUrl(referenceUrl, compareUrl) {

		if(referenceUrl.indexOf(Page.getBaseUrl()) == 0) {
			referenceUrl = referenceUrl.substr(Page.getBaseUrl().length);
		}

		if(compareUrl.indexOf(Page.getBaseUrl()) == 0) {
			compareUrl = compareUrl.substr(Page.getBaseUrl().length);
		}
		
		// Make sure the sections don't start with /
		referenceUrl = referenceUrl.indexOf("/") == 0 ? referenceUrl.substr(1) : referenceUrl;
		compareUrl = compareUrl.indexOf("/") == 0 ? compareUrl.substr(1) : compareUrl;

		var splits = compareUrl.split("/");
		var referenceSplits = referenceUrl.split("/");
		var returnCompare = "";
		_.each(splits, (split, key) =>{
			if(split.indexOf(":") == 0 && referenceSplits.length > key) {
				// Need to check if the split is more than the first level, we want to make sure
				// the previous section matches
				if(key > 0) {
					split = (referenceSplits[key -1] == splits[key -1] ? referenceSplits[key] : split);
				} else {
					split = referenceSplits[key];
				}

			}

			returnCompare += "/" + split;

		});
		
		// Take off the first / and add baseURl back in
		return Page.getBaseUrl() + returnCompare.substr(1);
	},
	actions: {
		go(url){
			browser.get(url);
			expect(Page.getConsoleErrors(), "Console Errors").to.eventually.eql([]);
			expect(Page.getCurrentUrl()).to.eventually.equal(url);
		},
		click(selector){
			element(selector).click();
		},
		custom(fn) {
			fn();
		}
	},
	expects: {
		custom: (fn) =>{
			fn();
		},
		pageAt: (url) => {
			if(url.indexOf("/") === 0) {
				url = url.substr(1);
			}
			Page.getCurrentUrl().then( currentUrl =>{
				expect(currentUrl).to.equal(Page._parseDynamicUrl(currentUrl, url))
			});

		}
	}
}
