'use strict';

import AbstractPageComponentTest from '../abstracts/abstract-page-component-test';
import DescribeBlock from '../common/describe-block';
import ExpectTests from '../common/expect-tests';
import TestDataHandler from '../common/test-data-handler';
import {CustomElementSetFieldEvents} from '../includes/custom-element-test-fns';

import _ from 'lodash';

import chai from "chai";
import promised from "chai-as-promised";
chai.use(promised);
var expect = chai.expect;

/*
    THINGS TO NOTE:
    Requireds test doesn't clear all inputs. So if it just does and edit page test,
    any data in form elements that aren't marked as required will not get cleared out.
 */

/*
    TODO
    requires need to check for name and ng-model attrs. Otherwise one could slip through no problem
 */
class TestForm extends AbstractPageComponentTest {
    testForm(callToCheckSuccess){
        var that = this;
        if(this.url) {
            var describe = new DescribeBlock("Test Generic Form");
            //describe.describe(this.addRequiredsTest(this.url, this.opts.fixture, callToCheckSuccess));
            describe.describe(this.addAllElementsTest(this.url, this.opts.fixture, callToCheckSuccess));

            this.addTest(describe);
        }
        if(this.addUrl) {
            this.testAddForm();
        }

        if(this.editUrl) {
            this.testEditForm();
        }

        return this;
    }
    testAddForm() {
       if(!this.addUrl) {
           this.throwError("You must provide an addUrl if you're testing an add form", this.opts);
       }
        var that = this;

        var describe = new DescribeBlock("Test Add Form");

        var callback = (testFormPointer)=>{
            return testFormPointer.getAllSuccessPageRequestResponses("POST").then( (request) =>{

                if(request.length > 0) {
                    that.id = request[0][that.ID_PROP];

                    return true;

                }
                return false;
            });
        };



        //describe.describe(this.addRequiredsTest(this.addUrl, this.opts.fixture, callback));
        describe.describe(this.addAllElementsTest(this.addUrl, this.opts.fixture, callback));

        if(this.editUrl) {
            describe.describe((this.addCheckEditForData( ()=>{
                return that.getEditUrl(that.id);
            }, this.opts.fixture)));

        }

        this.addTest(describe);

        return this;
    }

    testEditForm() {
        if(!this.editUrl) {
            this.throwError("You must provide an editUrl if you're testing an add form", this.opts);
        }

        var putFixture = this.copy(this.opts.fixture);
        putFixture = TestDataHandler.changeDataBasedOnType(putFixture, this.getStaticProperties());

        var that = this;
        var describe = new DescribeBlock("Test Edit Form");

        var callback = (testFormPointer)=>{
            return testFormPointer.getAllSuccessPageRequestResponses("PUT").then( (request) =>{
                if(request.length > 0) {
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

                    return testFormPointer.getAllErrorPageRequestResponses("PUT").then( (requests) =>{
                        if(requests.length) {
                            that.throwError("PUT request errors", requests);
                            return false;
                        } else {

                        }
                    });

                }

            });
        };
        var editUrl = ()=>{
            var id = that.id ? that.id : this.opts.fixture[that.ID_PROP];

            return this.getEditUrl(id);
        };

        //describe.describe(this.addRequiredsTest(editUrl, putFixture, callback));
        describe.describe(this.addAllElementsTest(editUrl, putFixture, callback));
        describe.describe(this.addCheckEditForData(editUrl, putFixture));

        this.addTest(describe);

        return this;
    }

    addCheckEditForData(url, fixture) {

        return this.testFormLoadsData(url, fixture);

    }

    addRequiredsTest(url, fixture, checkSuccess) {
        var describe = new DescribeBlock("Testing Requireds");

        describe.describe(this.testEmptyRequiresDontSubmit(url, describe));
        describe.describe(this.testFormSubmitsWithOnlyRequires(url, fixture, checkSuccess));

        return describe;

    }

    addAllElementsTest(url, fixture, checkSuccess) {
        var describe = new DescribeBlock("Testing All Elements");

        describe.describe(this.testFormSubmitsWithAllElements(url, fixture, checkSuccess));

        return describe;

    }


    /*
        Element fns
     */

    getFormXpath(){
        return `//form[@angular-validator and @name='${this.getFormName()}']`;
    }
    getAllElementsXpath(ngModelStart){
        return `//*[starts-with(@ng-model, '${ngModelStart}.')]`;
    }
    getRequiredElementsXpath(ngModelStart) {
        return `//*[starts-with(@ng-model, '${ngModelStart}.')][@required]`;
    }
    getNgRepeatXpath(ngModelStart) {
        return `//*[contains(@ng-repeat, '${ngModelStart}.')]`;
    }

    getFormElement(){
        return this.getElementByXpath(`//form[@angular-validator and @name='${this.getFormName()}']`);
    }



    getRequiredElements() {
        return this.getAllElementsByXpath(`//form[@angular-validator and @name='${this.getFormName()}']//*[starts-with(@ng-model, '${this.getNgModelSearch()}.')][@required]`);
    }
    getAllElements(){
        return this.getAllElementsByXpath(`//form[@angular-validator and @name='${this.getFormName()}']//*[starts-with(@ng-model, '${this.getNgModelSearch()}.')]`);
    }
    getNgRepeats(){
        return this.getAllElementsByXpath(`//form[@angular-validator and @name='${this.getFormName()}']//*[@ng-repeat]`);
    }



    clearField(elem) {
        return this.getElementData(elem).then( elementData =>{

            if( elementData.tagName != 'input' && elementData.tagName != 'textarea') {
                return;
            }

            if(elementData.attributes.type == "hidden") {
                return;
            }

            if(_.has(elementData.attributes, "type") && elementData.attributes.type == 'checkbox' ) {

                elem.isSelected().then( checked => {
                    if(checked) {
                        elem.click();
                    }

                });
                return;
            }

            elem.clear();
            return;

        });
    }
    setCustomField(tagName, elem, value) {
        if(_.has(CustomElementSetFieldEvents, tagName)) {
            return this.clearField(elem).then(()=>{
                CustomElementSetFieldEvents[tagName](elem, value);
            });

        } else {
            return this.setField(elem, value);
        }

    }
    setField(elem, value) {
        return this.clearField(elem).then(()=>{
            return this.getElementData(elem).then( (itemData)=>{
                switch(true) {
                    case itemData.attributes.type == "checkbox":
                        // We only want to check if value == true
                        if(value === true) {
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
    parseNgRepeats(getElementXpath, ngModelStart, fixture, fullFixtureParentKey, itemCallback, ngXpath = "") {
        var that = this;
        var repeatTracker = {}; // This keeps track of repeats using array data
        var newNestedPath =  ngXpath + this.getNgRepeatXpath(ngModelStart);
        return this.getAllElementsByXpath( this.getFormXpath() + newNestedPath ).each( item =>{
            that.getElementData(item).then( itemData =>{
                console.log(itemData);
                var ngRepeat = itemData.attributes['ng-repeat'];
                var split = ngRepeat.split(" in ");
                if(split.length < 2) {
                    return;
                }
                var subName = split[0].trim(); //vendor
                var parentName = split[1].trim(); // vm.editItem.FreightVendors

                if(parentName.indexOf(ngModelStart) !== 0) {
                    console.log("\n=================");
                    console.log(" Couldn't parse ng-repeat: ", ngRepeat, " , ", ngModelStart);
                }

                var baseFixtureLevel = parentName.substr(ngModelStart.length + 1); // FreightVendors
                var fullParentKey = fullFixtureParentKey.length > 0 ? fullFixtureParentKey + "." + baseFixtureLevel : baseFixtureLevel;

                //console.log("\n\nFULL FIXTURE: ", fullParentKey);
                var ngFixture = this.getFixtureValue(fixture, fullParentKey);
                if(!_.isArray(ngFixture)) {
                    console.log("\n=====================");
                    console.log(` NgRepeat ${ngRepeat} can't find array data for ${fullParentKey} in the following fixture:`);
                    return;

                }
                //console.log("===============\n NG DATA");
                //   console.log(subName, parentName, ngRepeat, baseFixtureLevel);
                // console.log(ngFixture);

                /*
                    We're keeping track of which fixture array element we get so we make sure to use what we can.
                 */

                var repeatTrackerName = itemData.tagName + ngRepeat;

                if(!_.has(repeatTracker,repeatTrackerName)) {
                    repeatTracker[repeatTrackerName] = 0;
                }

                /*
                    If the fixture has 1 sub object to test with and the page
                    expects there to be 2 objects to test with, like on a diversion where it needs to fill in
                    2 freight vendors, then we want to alert the unit test user, but not fail because
                    that might be what they're testing.
                 */
                if(ngFixture.length <= repeatTracker[repeatTrackerName]) {
                    console.log("\n===========================");
                    console.log("  Ran out of array fixtures to use ");
                    console.log(`for ${fullParentKey}. Array has ${ngFixture.length} fixtures to use.`);

                }

                /*
                    We still want this to go through because if we're getting the form data
                    we want to get all repeat data, even if we don't have fixture data for it.
                 */

                //var subFixture = ngFixture[repeatTracker[repeatTrackerName]];

                fullParentKey += `.[${repeatTracker[repeatTrackerName]}].`;
                repeatTracker[repeatTrackerName]++;

                // console.log(this.getFormXpath() + getElementXpath( subName ));
                return this.getAllElementsByXpath(this.getFormXpath() + newNestedPath + getElementXpath(subName)).each(item => {
                    that.getElementData(item).then(itemData => {


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
                }).then(()=> {
                    // add nested xpath
                    that.parseNgRepeats(getElementXpath, subName, fullParentKey, fixture, itemCallback);
                });


            });

        })
    }
    /*
        getElementXpath(ngModelStartText)
     */
    parseFormElements(getElementXpath, fixture, itemCallback) {
        if(!_.isFunction(getElementXpath)) {
            this.throwError("You must provide a fn for first arg of parseFormElements", getElementXpath);
        }

        var that = this;
       // console.log(this.getFormXpath() + getElementXpath( this.getNgModelSearch() ));
        return this.getAllElementsByXpath( this.getFormXpath() + getElementXpath( this.getNgModelSearch() )  ).each( item =>{
            that.getElementData(item).then( itemData =>{

                var ngModelName = itemData.attributes['ng-model'];

                if(!ngModelName){
                    return;
                }

                if(itemData.attributes['ng-model'].indexOf(that.getNgModelSearch()) !== 0) {
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
        }).then( ()=>{
            that.parseNgRepeats(getElementXpath, that.getNgModelSearch(), fixture,  "", itemCallback);
        });
    }
    getAllElementValues(xpath, fixture ) {
        var returnValueStructure = {}, that = this;

        return this.parseFormElements(xpath, fixture,
            (item, itemData, fixtureKey, fixtureValue)=>{
                var formValue = itemData.value;

                if(itemData.attributes.type) {

                    switch(itemData.attributes.type) {
                        case "number":
                            formValue = TestDataHandler.matchFixtureDataStructure(fixtureValue, formValue);
                            break;
                    }

                    that.setStructureValue(returnValueStructure, fixtureKey, formValue);

                } else if(that.isCustomElement(itemData.tagName)) {
                    that.getCustomElement(itemData.tagName, item).getAttribute('value').then( (gotValue)=>{
                        that.setStructureValue(returnValueStructure, fixtureKey, TestDataHandler.matchFixtureDataStructure(fixtureValue, gotValue) );
                    });
                } else {
                    that.setStructureValue(returnValueStructure, fixtureKey, TestDataHandler.matchFixtureDataStructure(fixtureValue, formValue) );
                }
            }).then( ()=> {
                return returnValueStructure;
            });

    }
    setElementsWithFixture(xpath, fixture) {
        var setElements = false, that = this;

        return this.parseFormElements(xpath, fixture,
                (item, itemData, fixtureKey, fixtureValue)=>{
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
                }).then( ()=>{
                    return setElements;
                });



    }
    callSuccessCheck(isSuccess) {
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
    testFormLoadsData(url, fixture) {
        var that = this;
        var describe = new DescribeBlock("Testing form loads data");
        var compareFixture;
        this.callPage(url, describe, ()=>{
            compareFixture = that.getAllElementValues( that.getAllElementsXpath, fixture).then( (data)=>{

                fixture = TestDataHandler.excludeProperties(this.getIgnoreProperties(), fixture);
                data = TestDataHandler.matchFixtureProperties(fixture, data);

                return data;
                //return TestDataHandler.fixValuesForComparison(fixture, data);
            });

        });

        describe.it("should match fixture data", ()=>{
           expect(compareFixture).to.eventually.eql(fixture);
        });

        return describe;
    }
    testEmptyRequiresDontSubmit(url){
        var that = this;
        var describe = new DescribeBlock("Testing empty requireds don't submit");

        var form, foundForm = false, foundRequireds = false;
        this.callPage(url, describe, ()=>{


            form = this.getFormElement();

            // Check that it found the form on the page correctly
            form.isPresent().then(()=>{
                foundForm = true;
            });

            that.parseFormElements(that.getRequiredElementsXpath, {}, (item)=>{
                foundRequireds = true;
                that.clearField(item);
            });

        });

        /*
         Add expects
         */
        describe.it("should have loaded form", ()=>{
            expect(foundForm).to.be.true;
        });
        describe.it("should NOT allow submit with blank requires", ()=>{
            if (foundRequireds) {
                form.submit();
                browser.waitForAngular();
                expect(browser.getCurrentUrl()).to.eventually.equal(that.parseUrl(url));
                expect(that.getElementClasses(form)).to.eventually.contain('ng-invalid-required');
                expect(that.getElementClasses(form)).to.eventually.contain('ng-submitted');

            } else {
                if(!foundRequireds) {
                    console.log("\n---> NO required elements found <---\n");
                }
                expect(true).to.be.true;
            }


        });

        return describe;

    }
    testFormSubmitsWithOnlyRequires(url, fixture, checkSuccess){
        var that = this;
        var describe = new DescribeBlock("Testing ONLY required elements submit");


        var form, foundForm = false, foundRequireds = false, isSubmitSuccessful = false;
        this.callPage(url, describe, ()=>{


            browser.getCurrentUrl().then( (url)=>{
               console.log(url);
            });
            form = this.getFormElement();
            // Check that it found the form on the page correctly
            form.isPresent().then(()=>{
                foundForm = true;
            });

            that.setElementsWithFixture( that.getRequiredElementsXpath, fixture).then( setSuccess => {

                foundRequireds = setSuccess;
                if(setSuccess) {
                    form.submit();
                    browser.waitForAngular();
                    isSubmitSuccessful = this.callSuccessCheck(checkSuccess);
                } else {
                    console.log("\n---> NO required elements found <---\n");
                }
            });

        });

        /*
         Add expects
         */
        describe.it("should have loaded form", ()=>{
            expect(foundForm).to.be.true;
        });
        describe.it("should submit with only requireds", ()=>{
            if (foundRequireds) {
                if(_.isBoolean(isSubmitSuccessful)) {
                    expect(isSubmitSuccessful).to.be.true;
                } else {
                    expect(isSubmitSuccessful).to.eventually.be.true;
                }


            } else {
                expect(true).to.be.true;
            }
        });
        ExpectTests.ShouldNot.ErrorOnPage(describe);

        return describe;
    }

    testFormSubmitsWithAllElements(url, fixture, checkSuccess){
        var that = this;
        var describe = new DescribeBlock("Testing all elements submit");

        var form, foundForm = false, isSubmitSuccessful = false;
        this.callPage(url, describe, ()=>{


            browser.getCurrentUrl().then( (url)=>{
                console.log(url);
            });
            form = this.getFormElement();

            //that.getNgRepeats().each((item)=>{
            //
            //    item.getAttribute('ng-repeat').then( ngRepeatValue =>{
            //        console.log("REPEAT: ", ngRepeatValue);
            //    });
            //}).then( ()=>{
                // Check that it found the form on the page correctly
                form.isPresent().then(()=>{
                    foundForm = true;
                });

                that.setElementsWithFixture( that.getAllElementsXpath, fixture).then( setSuccess => {

                    if(setSuccess) {
                        form.submit();
                        browser.waitForAngular();
                        browser.getCurrentUrl().then( (url)=>{
                            console.log(url);
                        });
                        isSubmitSuccessful = this.callSuccessCheck(checkSuccess);
                    } else {
                        console.log("\n---> NO elements found <---\n");
                    }
                });
              //});




        });

        /*
         Add expects
         */
        describe.it("should have loaded form", ()=>{
            expect(foundForm).to.be.true;
        });
        describe.it("should submit successfully", ()=>{

            if(_.isBoolean(isSubmitSuccessful)) {
                expect(isSubmitSuccessful).to.be.true;
            } else {
                expect(isSubmitSuccessful).to.eventually.be.true;
            }

        });
        ExpectTests.ShouldNot.ErrorOnPage(describe);

        return describe;
    }

}

export default TestForm;
