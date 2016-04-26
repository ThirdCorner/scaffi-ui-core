'use strict';

import DescribeBlock from '../common/describe-block';

import _ from 'lodash';

class AbstractTest {

    isDebugging(){
        return this.debugEnabled;
    }
    enableDebugging() {
        this.debugEnabled = true;
    }
    disableDebugging(){
        this.debugEnabled = false;
    }

    /*
        Test-specific fns
     */

    addTest(describeBlock){
        if(!_.isArray(this.tests)) {
            this.tests = [];
        }
        this.tests.push(describeBlock);

    }
    getTests(){
        if(!_.isArray(this.tests)) {
            this.tests = [];
        }
        return this.tests;
    }

    newSuite(describeText){
        this.Describe = new DescribeBlock(describeText);
        this.tests = [];
    }
    outputTests(){
        if(!_.isArray(this.tests)) {
            this.tests = [];
        }
        if(this.tests.length == 0) {
            this.throwError("No test--s provided!");
            return;
        }
        _.each(this.tests, function(test){
            test.output();
        }, this);

        this.tests = [];
    }

    /*
        Utility fns
     */

    copy(obj){
        return JSON.parse(JSON.stringify(obj))
    }
    throwError(errorMsg, data) {
        console.log("============ERROR============");
        console.log("MSG: ", errorMsg);

        var args = [];
        _.each(arguments, (value)=>{
            args.push(value);
        });
        args.shift();

        _.each(args, (value)=>{
            console.log("DATA: ", value);
        });

        console.log("=============================");
        throw errorMsg;
    }




}


export default AbstractTest;