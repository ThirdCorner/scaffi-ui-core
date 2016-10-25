'use strict';

import AbstractTest from './abstract-test';
import ScaffiCore from '../../index';

import {CustomElementParsers} from '../includes/custom-element-test-fns';
import TestDataHandler from '../common/test-data-handler';
import ParserHelper from '../../helpers/parser-helper';

import _ from 'lodash';

import chai from "chai";
import promised from "chai-as-promised";
chai.use(promised);
var expect = chai.expect;


class AbstractPageComponentTest extends AbstractTest {

    /*

     */
    constructor(opts) {
        super(opts);
    
        this.ID_PROP =  ScaffiCore.config.getIdPropertyName();
        //if(!opts.url) {
        //    this.throwError('Must provide a url to visit for any PageComponentTest', opts);
        //}
        this.opts = opts;

        if(!opts.fixture || !_.isObject(opts.fixture)){
            this.throwError("Must provide a fixture object to test.", opts);
        }
        if(!opts.formName) {
            this.throwError("Must provide a form name to test", opts);
        }
        if(!opts.ngModelStart) {
            this.throwError("Must provide an ngModelStart name that we plug the fixtures into", opts);
        }


    }

    getIgnoreProperties() {
        return this.opts.ignoreProperties || [];
    }
    getStaticProperties() {
        return this.opts.staticProperties || [];
    }
    getFormName(){
        return this.opts.formName || "";
    }
    getNgModelSearch(){
        return this.opts.ngModelStart || "";
    }
    getFixture(){
        return this.opts.fixture;
    }
    setPage(url){
        this.url = url;
        return this;
    }
    setAddPage(url){
        this.addUrl = url;
        return this;
    }
    setEditPage(url){
        this.editUrl = url;
        return this;
    }

    callPage(url, describe, onCall) {
        var that = this;
        var beginningUrl;
        var callUrl;
        describe.before(()=>{
            callUrl = that.parseUrl(url);
            that.startupPage(callUrl);
            beginningUrl = browser.getCurrentUrl();

            that.isErrorPopupShowing().then( (visible) =>{
               if(visible) {
                    that.getErrorPopupText().then( (errorText) =>{
                       that.throwError("Error thrown on page load. Is the API up? Can you navigate to the page yourself?", callUrl, errorText);
                        throw new Error("Stopping Execution!!!");
                    });

               } else {
                   onCall.call(that);
               }


            });


        });
        describe.it("should access the page", ()=>{
            expect(beginningUrl).to.eventually.equal(callUrl);
        });
        describe.after(()=>{
            that.shutdownPage();
        });

    }

    /*
        Page Action fns
     */
    parseUrl(url){
        if (_.isFunction(url)) {
            url = url();
        }

        if (!_.isString(url) || (_.isString(url) && url.length == 0)) {
            throw new Error("Improper URL provided for Page Test");
        }

        return url;
    }
    startupPage(url){
        url = this.parseUrl(url);
        console.log("startupPage: ", url)
        browser.get(url);

        // Record Server Requests
        element(by.id('start-test-exchange-recording')).click();
    }
    shutdownPage(){
        // Stop Recording Server Requests
        element(by.id('stop-test-exchange-recording')).click();
    }


    /*
        Element Specific fns
     */
    isErrorPopupShowing(){
        return element(by.xpath(`//server-error/div[contains(@class, 'showing')]`)).isPresent();
    }
    getErrorPopupText(){
        return element(by.xpath(`//server-error//div[@id='server-error-copy-me']/textarea`)).getText();
    }
    getElementByXpath(xpath) {
        return element(by.xpath(xpath));
    }

    getAllElementsByXpath(xpath){
        return element.all(by.xpath(xpath));
    }

    /*
        Array keys need to have brackets
        FreightVendors.[0].Name
     */
    setStructureValue(obj, key, value) {
        return ParserHelper.setObjectWithNestedKey(obj, key, value);
    }

    getEditUrl(id) {
        id = id || "";
        var url = this.parseUrl(this.editUrl);
        url = url.replace(":id", id);
        return url;
    }
    getElementAttribute(elem, attributeName){
        return elem.getAttribute(attributeName);
    }
    getElementAttributes(elem){
        function getAllAttributes () {
            var items = {};

            console.log(arguments[0]);

            for (var index = 0; index < arguments[0].attributes.length; ++index) {
                items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value;
            }
            return items;
        }

        return browser.executeScript(getAllAttributes, elem.getWebElement());
    }
    getElementClasses(elem) {
        return elem.getAttribute('class').then( (classes) => { return classes} );
    }
    getElementTag(elem) {
        return elem.getTagName();
    }
    isCustomElement(tagName) {
        return _.has(CustomElementParsers, tagName);
    }
    getCustomElement(tagName, parentNode) {
        if(this.isCustomElement(tagName)) {
            return CustomElementParsers[tagName](parentNode);
        }
        return null;
    }

    getAllErrorPageRequestResponses(requestType){
        var returnRequest = [];
        requestType = requestType.toUpperCase();
        return this.getAllElementsByXpath(`//div[@id='test-ui-harness']/*[contains(@class, 'type-${requestType}') and contains(@class, 'error')]/*[contains(@class, 'response')]`).each( (item)=>{
            item.getText().then( (text)=>{
                var request = text;
                try {
                    request = JSON.parse(request);

                } catch(e){}

                returnRequest.push(request);

            });
        }).then( ()=>{
            return returnRequest;
        });
    }
    /*
        Only returns success response
     */
    getAllSuccessPageRequestResponses(requestType) {
        var returnRequest = [];
        requestType = requestType.toUpperCase();
        return this.getAllElementsByXpath(`//div[@id='test-ui-harness']/*[contains(@class, 'type-${requestType}') and not(contains(@class, 'error'))]/*[contains(@class, 'response')]`).each( (item)=>{
            item.getText().then( (text)=>{
                var request = text;
                try {
                    request = JSON.parse(request);

                } catch(e){}

                returnRequest.push(request);

            });
        }).then( ()=>{
            return returnRequest;
        });
    }
    /*
        Element Action Fn
     */

    getElementData(elem) {
        var that = this;
        return that.getElementAttributes(elem).then( (attrs)=>{
           return that.getElementTag(elem).then( (tagName) =>{
               return that.getElementAttribute(elem, "value").then( (value) =>{
                   if(!value && _.has(attrs, "value")) {
                       value = attrs.value;
                   }

                   return {
                       tagName: tagName,
                       attributes: attrs || {},
                       value: value
                   };
               });
           });
        }).then( attrs => {

            if(attrs.attributes.type == 'checkbox') {
                return elem.isSelected().then( (checked) =>{
                    attrs.value = checked;
                    return attrs;
                })
            } else {
                return attrs;
            }
        });

    }
    getFixtureValue(fixture, key) {
       return ParserHelper.getValueWithNestedKey(fixture, key);
    }



}

export default AbstractPageComponentTest;
