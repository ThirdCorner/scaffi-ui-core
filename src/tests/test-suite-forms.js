//import _ from 'lodash';
//
//import chai from "chai";
//import promised from "chai-as-promised";
//chai.use(promised);
//var expect = chai.expect;
//import rp from 'request-promise';
//
//import DescribeBlock from './describe-block';
//
//const ID_NAME = DEFAULTS.COLLECTION_IDENTIFIER_NAME;
//const API_BASE = DEFAULTS.API_BASE;
//
//import TestSuiteItemBase from './TestSuiteItemBase';
//
//function copy(obj){
//    return JSON.parse(JSON.stringify(obj))
//}
//
//function fetchData(options) {
//    return rp(options);
//}
//
//class TestSuiteForms extends TestSuiteItemBase {
//
//    testFormSubmition(){
//        if(this.allowPOST(this.opts)) {
//            this.testPOSTFormSubmit();
//        }
//    }
//    testPOSTFormSubmit(){
//        var postOpts = this._makeRouteOpts(this.opts, "POST");
//        browser().navigateTo(postOpts.route);
//        expect(browser().location().path()).to.be(postOpts.route);
//    }
//    testPUTFormSubmit(){}
//
//    // Test that forms have proper bindings
//}
//
//export default TestSuiteForms;
import mainModule from '../../scaffi-core/index.js';
class TestForms {
    constructor() {
        console.log(mainModule);
        throw new Error("btehoeoth");
    }

}

export default TestForms;
