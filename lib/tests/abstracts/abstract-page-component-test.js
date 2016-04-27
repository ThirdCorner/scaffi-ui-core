'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractTest = require('./abstract-test');

var _abstractTest2 = _interopRequireDefault(_abstractTest);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

var _customElementTestFns = require('../includes/custom-element-test-fns');

var _testDataHandler = require('../common/test-data-handler');

var _testDataHandler2 = _interopRequireDefault(_testDataHandler);

var _parserHelper = require('../../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LOCALHOST;

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

var AbstractPageComponentTest = function (_AbstractTest) {
    _inherits(AbstractPageComponentTest, _AbstractTest);

    /*
       */

    function AbstractPageComponentTest(opts) {
        _classCallCheck(this, AbstractPageComponentTest);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractPageComponentTest).call(this, opts));

        LOCALHOST = _index2.default.config.getLocalhostAddress();
        _this.ID_PROP = _index2.default.config.getIdPropertyName();
        //if(!opts.url) {
        //    this.throwError('Must provide a url to visit for any PageComponentTest', opts);
        //}
        _this.opts = opts;

        if (!opts.fixture || !_lodash2.default.isObject(opts.fixture)) {
            _this.throwError("Must provide a fixture object to test.", opts);
        }
        if (!opts.formName) {
            _this.throwError("Must provide a form name to test", opts);
        }
        if (!opts.ngModelStart) {
            _this.throwError("Must provide an ngModelStart name that we plug the fixtures into", opts);
        }

        return _this;
    }

    _createClass(AbstractPageComponentTest, [{
        key: 'getIgnoreProperties',
        value: function getIgnoreProperties() {
            return this.opts.ignoreProperties || [];
        }
    }, {
        key: 'getStaticProperties',
        value: function getStaticProperties() {
            return this.opts.staticProperties || [];
        }
    }, {
        key: 'getFormName',
        value: function getFormName() {
            return this.opts.formName || "";
        }
    }, {
        key: 'getNgModelSearch',
        value: function getNgModelSearch() {
            return this.opts.ngModelStart || "";
        }
    }, {
        key: 'getFixture',
        value: function getFixture() {
            return this.opts.fixture;
        }
    }, {
        key: 'setPage',
        value: function setPage(url) {
            this.url = url;
            return this;
        }
    }, {
        key: 'setAddPage',
        value: function setAddPage(url) {
            this.addUrl = url;
            return this;
        }
    }, {
        key: 'setEditPage',
        value: function setEditPage(url) {
            this.editUrl = url;
            return this;
        }
    }, {
        key: 'callPage',
        value: function callPage(url, describe, onCall) {
            var that = this;
            var beginningUrl;
            var callUrl;
            describe.before(function () {
                callUrl = that.parseUrl(url);
                that.startupPage(callUrl);
                beginningUrl = browser.getCurrentUrl();

                that.isErrorPopupShowing().then(function (visible) {
                    if (visible) {
                        that.getErrorPopupText().then(function (errorText) {
                            that.throwError("Error thrown on page load. Is the API up? Can you navigate to the page yourself?", callUrl, errorText);
                            throw new Error("Stopping Execution!!!");
                        });
                    } else {
                        onCall.call(that);
                    }
                });
            });
            describe.it("should access the page", function () {
                expect(beginningUrl).to.eventually.equal(callUrl);
            });
            describe.after(function () {
                that.shutdownPage();
            });
        }

        /*
            Page Action fns
         */

    }, {
        key: 'parseUrl',
        value: function parseUrl(url) {
            if (_lodash2.default.isFunction(url)) {
                url = url();
            }

            if (!_lodash2.default.isString(url) || _lodash2.default.isString(url) && url.length == 0) {
                throw new Error("Improper URL provided for Page Test");
            }

            if (url.indexOf(LOCALHOST) === -1) {
                url = LOCALHOST + url;
            }

            return url;
        }
    }, {
        key: 'startupPage',
        value: function startupPage(url) {
            url = this.parseUrl(url);
            console.log("startupPage: ", url);
            browser.get(url);

            // Record Server Requests
            element(by.id('start-test-exchange-recording')).click();
        }
    }, {
        key: 'shutdownPage',
        value: function shutdownPage() {
            // Stop Recording Server Requests
            element(by.id('stop-test-exchange-recording')).click();
        }

        /*
            Element Specific fns
         */

    }, {
        key: 'isErrorPopupShowing',
        value: function isErrorPopupShowing() {
            return element(by.xpath('//server-error/div[contains(@class, \'showing\')]')).isPresent();
        }
    }, {
        key: 'getErrorPopupText',
        value: function getErrorPopupText() {
            return element(by.xpath('//server-error//div[@id=\'server-error-copy-me\']/textarea')).getText();
        }
    }, {
        key: 'getElementByXpath',
        value: function getElementByXpath(xpath) {
            return element(by.xpath(xpath));
        }
    }, {
        key: 'getAllElementsByXpath',
        value: function getAllElementsByXpath(xpath) {
            return element.all(by.xpath(xpath));
        }

        /*
            Array keys need to have brackets
            FreightVendors.[0].Name
         */

    }, {
        key: 'setStructureValue',
        value: function setStructureValue(obj, key, value) {
            return _parserHelper2.default.setObjectWithNestedKey(obj, key, value);
        }
    }, {
        key: 'getEditUrl',
        value: function getEditUrl(id) {
            id = id || "";
            var url = this.parseUrl(this.editUrl);
            url = url.replace(":id", id);
            return url;
        }
    }, {
        key: 'getElementAttribute',
        value: function getElementAttribute(elem, attributeName) {
            return elem.getAttribute(attributeName);
        }
    }, {
        key: 'getElementAttributes',
        value: function getElementAttributes(elem) {
            function getAllAttributes() {
                var items = {};

                console.log(arguments[0]);

                for (var index = 0; index < arguments[0].attributes.length; ++index) {
                    items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value;
                }
                return items;
            }

            return browser.executeScript(getAllAttributes, elem.getWebElement());
        }
    }, {
        key: 'getElementClasses',
        value: function getElementClasses(elem) {
            return elem.getAttribute('class').then(function (classes) {
                return classes;
            });
        }
    }, {
        key: 'getElementTag',
        value: function getElementTag(elem) {
            return elem.getTagName();
        }
    }, {
        key: 'isCustomElement',
        value: function isCustomElement(tagName) {
            return _lodash2.default.has(_customElementTestFns.CustomElementParsers, tagName);
        }
    }, {
        key: 'getCustomElement',
        value: function getCustomElement(tagName, parentNode) {
            if (this.isCustomElement(tagName)) {
                return _customElementTestFns.CustomElementParsers[tagName](parentNode);
            }
            return null;
        }
    }, {
        key: 'getAllErrorPageRequestResponses',
        value: function getAllErrorPageRequestResponses(requestType) {
            var returnRequest = [];
            requestType = requestType.toUpperCase();
            return this.getAllElementsByXpath('//div[@id=\'test-ui-harness\']/*[contains(@class, \'type-' + requestType + '\') and contains(@class, \'error\')]/*[contains(@class, \'response\')]').each(function (item) {
                item.getText().then(function (text) {
                    var request = text;
                    try {
                        request = JSON.parse(request);
                    } catch (e) {}

                    returnRequest.push(request);
                });
            }).then(function () {
                return returnRequest;
            });
        }
        /*
            Only returns success response
         */

    }, {
        key: 'getAllSuccessPageRequestResponses',
        value: function getAllSuccessPageRequestResponses(requestType) {
            var returnRequest = [];
            requestType = requestType.toUpperCase();
            return this.getAllElementsByXpath('//div[@id=\'test-ui-harness\']/*[contains(@class, \'type-' + requestType + '\') and not(contains(@class, \'error\'))]/*[contains(@class, \'response\')]').each(function (item) {
                item.getText().then(function (text) {
                    var request = text;
                    try {
                        request = JSON.parse(request);
                    } catch (e) {}

                    returnRequest.push(request);
                });
            }).then(function () {
                return returnRequest;
            });
        }
        /*
            Element Action Fn
         */

    }, {
        key: 'getElementData',
        value: function getElementData(elem) {
            var that = this;
            return that.getElementAttributes(elem).then(function (attrs) {
                return that.getElementTag(elem).then(function (tagName) {
                    return that.getElementAttribute(elem, "value").then(function (value) {
                        if (!value && _lodash2.default.has(attrs, "value")) {
                            value = attrs.value;
                        }

                        return {
                            tagName: tagName,
                            attributes: attrs || {},
                            value: value
                        };
                    });
                });
            }).then(function (attrs) {

                if (attrs.attributes.type == 'checkbox') {
                    return elem.isSelected().then(function (checked) {
                        attrs.value = checked;
                        return attrs;
                    });
                } else {
                    return attrs;
                }
            });
        }
    }, {
        key: 'getFixtureValue',
        value: function getFixtureValue(fixture, key) {
            return _parserHelper2.default.getValueWithNestedKey(fixture, key);
        }
    }]);

    return AbstractPageComponentTest;
}(_abstractTest2.default);

exports.default = AbstractPageComponentTest;