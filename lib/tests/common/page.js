'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	getBaseUrl: function getBaseUrl() {
		return _index2.default.config.getApiBase();
	},
	getCurrentUrl: function getCurrentUrl() {
		return browser.getCurrentUrl();
	},
	getConsoleErrors: function getConsoleErrors() {
		return browser.manage().logs().get('browser').then(function (browserLog) {
			var errors = [];
			_lodash2.default.each(browserLog, function (log) {
				if (log.level.name === "WARNING" || log.level.name === "ERROR") {
					errors.push(log);
				}
			}, this);
			return errors;
		});
	},
	hasConsoleErrors: function hasConsoleErrors() {
		return this.getConsoleErrors().then(function (errors) {
			return errors.length > 0 ? true : false;
		});
	},
	element: function element(searchElm) {
		return browser.findElement(searchElm);
	},
	_parseDynamicUrl: function _parseDynamicUrl(referenceUrl, compareUrl) {

		if (referenceUrl.indexOf(Page.getBaseUrl()) == 0) {
			referenceUrl = referenceUrl.substr(Page.getBaseUrl().length);
		}

		if (compareUrl.indexOf(Page.getBaseUrl()) == 0) {
			compareUrl = compareUrl.substr(Page.getBaseUrl().length);
		}

		// Make sure the sections don't start with /
		referenceUrl = referenceUrl.indexOf("/") == 0 ? referenceUrl.substr(1) : referenceUrl;
		compareUrl = compareUrl.indexOf("/") == 0 ? compareUrl.substr(1) : compareUrl;

		var splits = compareUrl.split("/");
		var referenceSplits = referenceUrl.split("/");
		var returnCompare = "";
		_lodash2.default.each(splits, function (split, key) {
			if (split.indexOf(":") == 0 && referenceSplits.length > key) {
				// Need to check if the split is more than the first level, we want to make sure
				// the previous section matches
				if (key > 0) {
					split = referenceSplits[key - 1] == splits[key - 1] ? referenceSplits[key] : split;
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
		go: function go(url) {
			browser.get(url);
			expect(Page.getConsoleErrors(), "Console Errors").to.eventually.eql([]);
			expect(Page.getCurrentUrl()).to.eventually.equal(url);
		},
		click: function click(selector) {
			element(selector).click();
		},
		custom: function custom(fn) {
			fn();
		}
	},
	expects: {
		custom: function custom(fn) {
			fn();
		},
		pageAt: function pageAt(url) {
			if (url.indexOf("/") === 0) {
				url = url.substr(1);
			}
			Page.getCurrentUrl().then(function (currentUrl) {
				expect(currentUrl).to.equal(Page._parseDynamicUrl(currentUrl, url));
			});
		}
	}
};