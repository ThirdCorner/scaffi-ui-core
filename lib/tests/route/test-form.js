'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _abstractPageComponentTest = require('../abstracts/abstract-page-component-test');

var _abstractPageComponentTest2 = _interopRequireDefault(_abstractPageComponentTest);

var _describeBlock = require('../common/describe-block');

var _describeBlock2 = _interopRequireDefault(_describeBlock);

var _expectTests = require('../common/expect-tests');

var _expectTests2 = _interopRequireDefault(_expectTests);

var _testDataHandler = require('../common/test-data-handler');

var _testDataHandler2 = _interopRequireDefault(_testDataHandler);

var _customElementTestFns = require('../includes/custom-element-test-fns');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

/*
    THINGS TO NOTE:
    Requireds test doesn't clear all inputs. So if it just does and edit page test,
    any data in form elements that aren't marked as required will not get cleared out.
 */

/*
    TODO
    requires need to check for name and ng-model attrs. Otherwise one could slip through no problem
 */

var TestForm = function (_AbstractPageComponen) {
    (0, _inherits3.default)(TestForm, _AbstractPageComponen);

    function TestForm() {
        (0, _classCallCheck3.default)(this, TestForm);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TestForm).apply(this, arguments));
    }

    (0, _createClass3.default)(TestForm, [{
        key: 'testForm',
        value: function testForm(callToCheckSuccess) {
            var that = this;
            if (this.url) {
                var describe = new _describeBlock2.default("Test Generic Form");
                //describe.describe(this.addRequiredsTest(this.url, this.opts.fixture, callToCheckSuccess));
                describe.describe(this.addAllElementsTest(this.url, this.opts.fixture, callToCheckSuccess));

                this.addTest(describe);
            }
            if (this.addUrl) {
                this.testAddForm();
            }

            if (this.editUrl) {
                this.testEditForm();
            }

            return this;
        }
    }, {
        key: 'testAddForm',
        value: function testAddForm() {
            if (!this.addUrl) {
                this.throwError("You must provide an addUrl if you're testing an add form", this.opts);
            }
            var that = this;

            var describe = new _describeBlock2.default("Test Add Form");

            var callback = function callback(testFormPointer) {
                return testFormPointer.getAllSuccessPageRequestResponses("POST").then(function (request) {

                    if (request.length > 0) {
                        that.id = request[0][that.ID_PROP];

                        return true;
                    }
                    return false;
                });
            };

            //describe.describe(this.addRequiredsTest(this.addUrl, this.opts.fixture, callback));
            describe.describe(this.addAllElementsTest(this.addUrl, this.opts.fixture, callback));

            if (this.editUrl) {
                describe.describe(this.addCheckEditForData(function () {
                    return that.getEditUrl(that.id);
                }, this.opts.fixture));
            }

            this.addTest(describe);

            return this;
        }
    }, {
        key: 'testEditForm',
        value: function testEditForm() {
            var _this2 = this;

            if (!this.editUrl) {
                this.throwError("You must provide an editUrl if you're testing an add form", this.opts);
            }

            var putFixture = this.copy(this.opts.fixture);
            putFixture = _testDataHandler2.default.changeDataBasedOnType(putFixture, this.getStaticProperties());

            var that = this;
            var describe = new _describeBlock2.default("Test Edit Form");

            var callback = function callback(testFormPointer) {
                return testFormPointer.getAllSuccessPageRequestResponses("PUT").then(function (request) {
                    if (request.length > 0) {
                        return true;
                    } else {
                        /*
                            TODO
                              !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            -need to figure out why the form isn't submitting. I'm getting 0
                            responses, either error or otherwise.
                            -Then clean up test display for object compares.
                            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                         */

                        return testFormPointer.getAllErrorPageRequestResponses("PUT").then(function (requests) {
                            if (requests.length) {
                                that.throwError("PUT request errors", requests);
                                return false;
                            } else {}
                        });
                    }
                });
            };
            var editUrl = function editUrl() {
                var id = that.id ? that.id : _this2.opts.fixture[that.ID_PROP];

                return _this2.getEditUrl(id);
            };

            //describe.describe(this.addRequiredsTest(editUrl, putFixture, callback));
            describe.describe(this.addAllElementsTest(editUrl, putFixture, callback));
            describe.describe(this.addCheckEditForData(editUrl, putFixture));

            this.addTest(describe);

            return this;
        }
    }, {
        key: 'addCheckEditForData',
        value: function addCheckEditForData(url, fixture) {

            return this.testFormLoadsData(url, fixture);
        }
    }, {
        key: 'addRequiredsTest',
        value: function addRequiredsTest(url, fixture, checkSuccess) {
            var describe = new _describeBlock2.default("Testing Requireds");

            describe.describe(this.testEmptyRequiresDontSubmit(url, describe));
            describe.describe(this.testFormSubmitsWithOnlyRequires(url, fixture, checkSuccess));

            return describe;
        }
    }, {
        key: 'addAllElementsTest',
        value: function addAllElementsTest(url, fixture, checkSuccess) {
            var describe = new _describeBlock2.default("Testing All Elements");

            describe.describe(this.testFormSubmitsWithAllElements(url, fixture, checkSuccess));

            return describe;
        }

        /*
            Element fns
         */

    }, {
        key: 'getFormXpath',
        value: function getFormXpath() {
            return '//form[@angular-validator and @name=\'' + this.getFormName() + '\']';
        }
    }, {
        key: 'getAllElementsXpath',
        value: function getAllElementsXpath(ngModelStart) {
            return '//*[starts-with(@ng-model, \'' + ngModelStart + '.\')]';
        }
    }, {
        key: 'getRequiredElementsXpath',
        value: function getRequiredElementsXpath(ngModelStart) {
            return '//*[starts-with(@ng-model, \'' + ngModelStart + '.\')][@required]';
        }
    }, {
        key: 'getNgRepeatXpath',
        value: function getNgRepeatXpath(ngModelStart) {
            return '//*[contains(@ng-repeat, \'' + ngModelStart + '.\')]';
        }
    }, {
        key: 'getFormElement',
        value: function getFormElement() {
            return this.getElementByXpath('//form[@angular-validator and @name=\'' + this.getFormName() + '\']');
        }
    }, {
        key: 'getRequiredElements',
        value: function getRequiredElements() {
            return this.getAllElementsByXpath('//form[@angular-validator and @name=\'' + this.getFormName() + '\']//*[starts-with(@ng-model, \'' + this.getNgModelSearch() + '.\')][@required]');
        }
    }, {
        key: 'getAllElements',
        value: function getAllElements() {
            return this.getAllElementsByXpath('//form[@angular-validator and @name=\'' + this.getFormName() + '\']//*[starts-with(@ng-model, \'' + this.getNgModelSearch() + '.\')]');
        }
    }, {
        key: 'getNgRepeats',
        value: function getNgRepeats() {
            return this.getAllElementsByXpath('//form[@angular-validator and @name=\'' + this.getFormName() + '\']//*[@ng-repeat]');
        }
    }, {
        key: 'clearField',
        value: function clearField(elem) {
            return this.getElementData(elem).then(function (elementData) {

                if (elementData.tagName != 'input' && elementData.tagName != 'textarea') {
                    return;
                }

                if (elementData.attributes.type == "hidden") {
                    return;
                }

                if (_lodash2.default.has(elementData.attributes, "type") && elementData.attributes.type == 'checkbox') {

                    elem.isSelected().then(function (checked) {
                        if (checked) {
                            elem.click();
                        }
                    });
                    return;
                }

                elem.clear();
                return;
            });
        }
    }, {
        key: 'setCustomField',
        value: function setCustomField(tagName, elem, value) {
            if (_lodash2.default.has(_customElementTestFns.CustomElementSetFieldEvents, tagName)) {
                return this.clearField(elem).then(function () {
                    _customElementTestFns.CustomElementSetFieldEvents[tagName](elem, value);
                });
            } else {
                return this.setField(elem, value);
            }
        }
    }, {
        key: 'setField',
        value: function setField(elem, value) {
            var _this3 = this;

            return this.clearField(elem).then(function () {
                return _this3.getElementData(elem).then(function (itemData) {
                    switch (true) {
                        case itemData.attributes.type == "checkbox":
                            // We only want to check if value == true
                            if (value === true) {
                                elem.click();
                            }
                            break;

                        default:
                            elem.sendKeys(value);
                    }
                });
            });
            // TODO Need to at least account for dates
        }

        /*
            getElementXpath: fn that takes a string to do a find for specific elements that have a model starting with
            ngModelStart: What the ngRepeat model should be
            fixture: full fixture that applies to this specific form
            fullFixtureParentKey: FreightVendors.[1].InvoiceData.Number etc this does not include the vm.editItem bit
            ngXPath is optional for building a nested ng-repeat path
         */

    }, {
        key: 'parseNgRepeats',
        value: function parseNgRepeats(getElementXpath, ngModelStart, fixture, fullFixtureParentKey, itemCallback) {
            var _this4 = this;

            var ngXpath = arguments.length <= 5 || arguments[5] === undefined ? "" : arguments[5];

            var that = this;
            var repeatTracker = {}; // This keeps track of repeats using array data
            var newNestedPath = ngXpath + this.getNgRepeatXpath(ngModelStart);
            return this.getAllElementsByXpath(this.getFormXpath() + newNestedPath).each(function (item) {
                that.getElementData(item).then(function (itemData) {
                    console.log(itemData);
                    var ngRepeat = itemData.attributes['ng-repeat'];
                    var split = ngRepeat.split(" in ");
                    if (split.length < 2) {
                        return;
                    }
                    var subName = split[0].trim(); //vendor
                    var parentName = split[1].trim(); // vm.editItem.FreightVendors

                    if (parentName.indexOf(ngModelStart) !== 0) {
                        console.log("\n=================");
                        console.log(" Couldn't parse ng-repeat: ", ngRepeat, " , ", ngModelStart);
                    }

                    var baseFixtureLevel = parentName.substr(ngModelStart.length + 1); // FreightVendors
                    var fullParentKey = fullFixtureParentKey.length > 0 ? fullFixtureParentKey + "." + baseFixtureLevel : baseFixtureLevel;

                    //console.log("\n\nFULL FIXTURE: ", fullParentKey);
                    var ngFixture = _this4.getFixtureValue(fixture, fullParentKey);
                    if (!_lodash2.default.isArray(ngFixture)) {
                        console.log("\n=====================");
                        console.log(' NgRepeat ' + ngRepeat + ' can\'t find array data for ' + fullParentKey + ' in the following fixture:');
                        return;
                    }
                    //console.log("===============\n NG DATA");
                    //   console.log(subName, parentName, ngRepeat, baseFixtureLevel);
                    // console.log(ngFixture);

                    /*
                        We're keeping track of which fixture array element we get so we make sure to use what we can.
                     */

                    var repeatTrackerName = itemData.tagName + ngRepeat;

                    if (!_lodash2.default.has(repeatTracker, repeatTrackerName)) {
                        repeatTracker[repeatTrackerName] = 0;
                    }

                    /*
                        If the fixture has 1 sub object to test with and the page
                        expects there to be 2 objects to test with, like on a diversion where it needs to fill in
                        2 freight vendors, then we want to alert the unit test user, but not fail because
                        that might be what they're testing.
                     */
                    if (ngFixture.length <= repeatTracker[repeatTrackerName]) {
                        console.log("\n===========================");
                        console.log("  Ran out of array fixtures to use ");
                        console.log('for ' + fullParentKey + '. Array has ' + ngFixture.length + ' fixtures to use.');
                    }

                    /*
                        We still want this to go through because if we're getting the form data
                        we want to get all repeat data, even if we don't have fixture data for it.
                     */

                    //var subFixture = ngFixture[repeatTracker[repeatTrackerName]];

                    fullParentKey += '.[' + repeatTracker[repeatTrackerName] + '].';
                    repeatTracker[repeatTrackerName]++;

                    // console.log(this.getFormXpath() + getElementXpath( subName ));
                    return _this4.getAllElementsByXpath(_this4.getFormXpath() + newNestedPath + getElementXpath(subName)).each(function (item) {
                        that.getElementData(item).then(function (itemData) {

                            var ngModelName = itemData.attributes['ng-model'];

                            if (!ngModelName) {
                                return;
                            }

                            var fixtureKey = fullParentKey + ngModelName.substr(subName.length + 1);
                            // console.log(fixt)
                            //Make fixture nested key if ng-repeat
                            var fixtureValue = that.getFixtureValue(fixture, fixtureKey);
                            //console.log(fixtureKey, " -> ",  ngModelName, ": ", fixtureValue);

                            itemCallback(item, itemData, fixtureKey, fixtureValue);
                        });
                    }).then(function () {
                        // add nested xpath
                        that.parseNgRepeats(getElementXpath, subName, fullParentKey, fixture, itemCallback);
                    });
                });
            });
        }
        /*
            getElementXpath(ngModelStartText)
         */

    }, {
        key: 'parseFormElements',
        value: function parseFormElements(getElementXpath, fixture, itemCallback) {
            if (!_lodash2.default.isFunction(getElementXpath)) {
                this.throwError("You must provide a fn for first arg of parseFormElements", getElementXpath);
            }

            var that = this;
            // console.log(this.getFormXpath() + getElementXpath( this.getNgModelSearch() ));
            return this.getAllElementsByXpath(this.getFormXpath() + getElementXpath(this.getNgModelSearch())).each(function (item) {
                that.getElementData(item).then(function (itemData) {

                    var ngModelName = itemData.attributes['ng-model'];

                    if (!ngModelName) {
                        return;
                    }

                    if (itemData.attributes['ng-model'].indexOf(that.getNgModelSearch()) !== 0) {
                        return;
                    }

                    var fixtureKey = ngModelName.substr(that.getNgModelSearch().length + 1);
                    //Make fixture nested key if ng-repeat
                    var fixtureValue = that.getFixtureValue(fixture, fixtureKey);
                    //console.log(ngModelName, ": ", fixtureValue);
                    itemCallback(item, itemData, fixtureKey, fixtureValue);

                    /*
                        Parse ng-repeats and do the same thing
                     */
                });
            }).then(function () {
                that.parseNgRepeats(getElementXpath, that.getNgModelSearch(), fixture, "", itemCallback);
            });
        }
    }, {
        key: 'getAllElementValues',
        value: function getAllElementValues(xpath, fixture) {
            var returnValueStructure = {},
                that = this;

            return this.parseFormElements(xpath, fixture, function (item, itemData, fixtureKey, fixtureValue) {
                var formValue = itemData.value;

                if (itemData.attributes.type) {

                    switch (itemData.attributes.type) {
                        case "number":
                            formValue = _testDataHandler2.default.matchFixtureDataStructure(fixtureValue, formValue);
                            break;
                    }

                    that.setStructureValue(returnValueStructure, fixtureKey, formValue);
                } else if (that.isCustomElement(itemData.tagName)) {
                    that.getCustomElement(itemData.tagName, item).getAttribute('value').then(function (gotValue) {
                        that.setStructureValue(returnValueStructure, fixtureKey, _testDataHandler2.default.matchFixtureDataStructure(fixtureValue, gotValue));
                    });
                } else {
                    that.setStructureValue(returnValueStructure, fixtureKey, _testDataHandler2.default.matchFixtureDataStructure(fixtureValue, formValue));
                }
            }).then(function () {
                return returnValueStructure;
            });
        }
    }, {
        key: 'setElementsWithFixture',
        value: function setElementsWithFixture(xpath, fixture) {
            var setElements = false,
                that = this;

            return this.parseFormElements(xpath, fixture, function (item, itemData, fixtureKey, fixtureValue) {
                if (['input', 'select', 'textarea'].indexOf(itemData.tagName) !== -1) {

                    if (itemData.attributes.type == "hidden") {
                        return false;
                    }

                    //console.log("\n\n======================");
                    //console.log("Local: ", localName);
                    //console.log("Value: ", value);
                    //console.log(itemData);
                    //console.log("========================\n\n");

                    that.setField(item, fixtureValue);
                    setElements = true;
                    return true;
                }

                if (that.isCustomElement(itemData.tagName)) {
                    //console.log("\n\n======================CUSTOM!!!");
                    //console.log("Local: ", localName);
                    //console.log("Value: ", value);
                    //console.log(itemData);
                    //console.log("========================\n\n");

                    var customElement = that.getCustomElement(itemData.tagName, item);
                    that.setCustomField(itemData.tagName, customElement, fixtureValue);
                    setElements = true;
                    return true;
                }

                console.log("\n~~~ Can't Set Model for element ~~~\n", itemData, "\n");
                return false;
            }).then(function () {
                return setElements;
            });
        }
    }, {
        key: 'callSuccessCheck',
        value: function callSuccessCheck(isSuccess) {
            return isSuccess(this);
        }

        /*
            Page Element Getters
         */

        /*
            Specific Test Functions
         */
        /*
            REQUIRES
         */

    }, {
        key: 'testFormLoadsData',
        value: function testFormLoadsData(url, fixture) {
            var _this5 = this;

            var that = this;
            var describe = new _describeBlock2.default("Testing form loads data");
            var compareFixture;
            this.callPage(url, describe, function () {
                compareFixture = that.getAllElementValues(that.getAllElementsXpath, fixture).then(function (data) {

                    fixture = _testDataHandler2.default.excludeProperties(_this5.getIgnoreProperties(), fixture);
                    data = _testDataHandler2.default.matchFixtureProperties(fixture, data);

                    return data;
                    //return TestDataHandler.fixValuesForComparison(fixture, data);
                });
            });

            describe.it("should match fixture data", function () {
                expect(compareFixture).to.eventually.eql(fixture);
            });

            return describe;
        }
    }, {
        key: 'testEmptyRequiresDontSubmit',
        value: function testEmptyRequiresDontSubmit(url) {
            var _this6 = this;

            var that = this;
            var describe = new _describeBlock2.default("Testing empty requireds don't submit");

            var form,
                foundForm = false,
                foundRequireds = false;
            this.callPage(url, describe, function () {

                form = _this6.getFormElement();

                // Check that it found the form on the page correctly
                form.isPresent().then(function () {
                    foundForm = true;
                });

                that.parseFormElements(that.getRequiredElementsXpath, {}, function (item) {
                    foundRequireds = true;
                    that.clearField(item);
                });
            });

            /*
             Add expects
             */
            describe.it("should have loaded form", function () {
                expect(foundForm).to.be.true;
            });
            describe.it("should NOT allow submit with blank requires", function () {
                if (foundRequireds) {
                    form.submit();
                    browser.waitForAngular();
                    expect(browser.getCurrentUrl()).to.eventually.equal(that.parseUrl(url));
                    expect(that.getElementClasses(form)).to.eventually.contain('ng-invalid-required');
                    expect(that.getElementClasses(form)).to.eventually.contain('ng-submitted');
                } else {
                    if (!foundRequireds) {
                        console.log("\n---> NO required elements found <---\n");
                    }
                    expect(true).to.be.true;
                }
            });

            return describe;
        }
    }, {
        key: 'testFormSubmitsWithOnlyRequires',
        value: function testFormSubmitsWithOnlyRequires(url, fixture, checkSuccess) {
            var _this7 = this;

            var that = this;
            var describe = new _describeBlock2.default("Testing ONLY required elements submit");

            var form,
                foundForm = false,
                foundRequireds = false,
                isSubmitSuccessful = false;
            this.callPage(url, describe, function () {

                browser.getCurrentUrl().then(function (url) {
                    console.log(url);
                });
                form = _this7.getFormElement();
                // Check that it found the form on the page correctly
                form.isPresent().then(function () {
                    foundForm = true;
                });

                that.setElementsWithFixture(that.getRequiredElementsXpath, fixture).then(function (setSuccess) {

                    foundRequireds = setSuccess;
                    if (setSuccess) {
                        form.submit();
                        browser.waitForAngular();
                        isSubmitSuccessful = _this7.callSuccessCheck(checkSuccess);
                    } else {
                        console.log("\n---> NO required elements found <---\n");
                    }
                });
            });

            /*
             Add expects
             */
            describe.it("should have loaded form", function () {
                expect(foundForm).to.be.true;
            });
            describe.it("should submit with only requireds", function () {
                if (foundRequireds) {
                    if (_lodash2.default.isBoolean(isSubmitSuccessful)) {
                        expect(isSubmitSuccessful).to.be.true;
                    } else {
                        expect(isSubmitSuccessful).to.eventually.be.true;
                    }
                } else {
                    expect(true).to.be.true;
                }
            });
            _expectTests2.default.ShouldNot.ErrorOnPage(describe);

            return describe;
        }
    }, {
        key: 'testFormSubmitsWithAllElements',
        value: function testFormSubmitsWithAllElements(url, fixture, checkSuccess) {
            var _this8 = this;

            var that = this;
            var describe = new _describeBlock2.default("Testing all elements submit");

            var form,
                foundForm = false,
                isSubmitSuccessful = false;
            this.callPage(url, describe, function () {

                browser.getCurrentUrl().then(function (url) {
                    console.log(url);
                });
                form = _this8.getFormElement();

                //that.getNgRepeats().each((item)=>{
                //
                //    item.getAttribute('ng-repeat').then( ngRepeatValue =>{
                //        console.log("REPEAT: ", ngRepeatValue);
                //    });
                //}).then( ()=>{
                // Check that it found the form on the page correctly
                form.isPresent().then(function () {
                    foundForm = true;
                });

                that.setElementsWithFixture(that.getAllElementsXpath, fixture).then(function (setSuccess) {

                    if (setSuccess) {
                        form.submit();
                        browser.waitForAngular();
                        browser.getCurrentUrl().then(function (url) {
                            console.log(url);
                        });
                        isSubmitSuccessful = _this8.callSuccessCheck(checkSuccess);
                    } else {
                        console.log("\n---> NO elements found <---\n");
                    }
                });
                //});
            });

            /*
             Add expects
             */
            describe.it("should have loaded form", function () {
                expect(foundForm).to.be.true;
            });
            describe.it("should submit successfully", function () {

                if (_lodash2.default.isBoolean(isSubmitSuccessful)) {
                    expect(isSubmitSuccessful).to.be.true;
                } else {
                    expect(isSubmitSuccessful).to.eventually.be.true;
                }
            });
            _expectTests2.default.ShouldNot.ErrorOnPage(describe);

            return describe;
        }
    }]);
    return TestForm;
}(_abstractPageComponentTest2.default);

exports.default = TestForm;