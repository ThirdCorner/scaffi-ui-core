import _ from 'lodash';

import chai from "chai";
import promised from "chai-as-promised";
chai.use(promised);
var expect = chai.expect;
import rp from 'request-promise';

import TestDataHandler from '../common/test-data-handler';
import AbstractApiTest from '../abstracts/abstract-api-test';
import DescribeBlock from '../common/describe-block';

import ScaffiCore from '../../index';

class TestRest extends AbstractApiTest {
    initialize(){

        // Need to redo this so I can build the text dynamically. This is AbstractTest.js
        this.Describe = new DescribeBlock("TESTING " + this.API_BASE);
        this.addTest(this.Describe);

        this.error = null;


        if(this.opts.id && !this.opts.fixture) {
            this.callGET();
        }

    }
    //outputTests(){
    //    this.Describe.output();
    //
    //    this.Describe = new DescribeBlock();
    //    this.error = null;
    //
    //
    //}
    getIgnoreProperties(){
        if(this.opts.ignoreProperties) {
            return this.opts.ignoreProperties;
        }

        return [];
    }

    getID() {
        return this.opts.id;
    }
    setIDFromResponse(response){
        if(_.isNumber(response)) {
            this.opts.id = response;
        } else if(_.isObject(response) && _.has(response, this.ID_PROP)) {
            this.opts.id = response[this.ID_PROP];
            if(!_.isNumber(response[this.ID_PROP])){
                this.opts.id = parseInt(response[this.ID_PROP], 10);
            }
        }
    }


    callServer(methodType, changeFixture, params, callback){

        var that = this;

        this.Describe.before((done)=>{


            var customFixture = false, currentFixture = that.getFixture(), newFixture;
            var id = that.getID();

            if(changeFixture) {
                customFixture = true;
                if(_.isObject(currentFixture)) {
                    currentFixture = that.copy(currentFixture);
                }

                if(_.isFunction(changeFixture)) {
                    currentFixture = changeFixture(currentFixture);
                } else {
                    currentFixture = that.copy(changeFixture);
                }


                newFixture = currentFixture;

                if(_.has(newFixture, that.ID_PROP)) {
                    id = newFixture[that.ID_PROP];
                }

            } else if(_.isObject(currentFixture)){
                newFixture = that.copy(currentFixture);
            }


            var options = that.makeServerOpts(methodType, this.getRoute(methodType));

            switch(methodType) {
                case "GET":
                    if(!id && _.isObject(newFixture) && newFixture[that.ID_PROP]) {
                        id = newFixture[that.ID_PROP];
                    }

                    if(!id) {
                        that.throwError("ID not provide for GET requset", that.opts)
                    }

                    break;
                case "POST":
                    if(id) {
                        id = null;
                    }
                    if(_.isObject(newFixture) && newFixture[that.ID_PROP]) {
                        delete newFixture[that.ID_PROP];
                    }

                    if(!newFixture) {
                        that.throwError("newFixture not provided for POST request", that.opts);
                    }

                    break;
                case "PUT":
                    if(!id && _.isObject(newFixture) && newFixture[that.ID_PROP]) {
                        id = newFixture[that.ID_PROP];
                    }

                    if(!id || !newFixture) {
                        that.throwError("Either ID not provided or newFixture not provided for PUT request!", that.opts, id, newFixture);
                    }

                    // Need to scramble data if no custom newFixture was provided
                    if(!customFixture) {
                        newFixture = TestDataHandler.changeDataBasedOnType(newFixture, this.getIgnoreProperties());
                    }
                    break;
                case "DELETE":
                    if(!id && _.isObject(newFixture) && newFixture[that.ID_PROP]) {
                        id = newFixture[that.ID_PROP];
                    }

                    if(!id) {
                        that.throwError("ID not provide for DELETE request", that.opts)
                    }
                    break;
                case "LIST":
                    options.method = methodType = "GET";
                    break;
            }

            options.form = newFixture;

            if(options.uri.indexOf(":id") !== -1) {
                if(!id) {
                    that.throwError("No ID provided where url requires one!", that.opts, options);
                } else {
                    options.uri = options.uri.replace(":id", id);
                }
            }

            if(params) {
                options.qs = params;
            }

            if(that.isDebugging()) {
                console.log("##################################");
                console.log("SENDING TO SERVER");
                console.log("OPTS: ", options);
                console.log("##################################\n");
            }
            that.fetchData(options).then((response)=>{
                if(that.isDebugging()) {
                    console.log("\n##################################");
                    console.log("RECEIVED FROM SERVER");
                    console.log("RESPONSE: ", response);
                    console.log("\nTEST FIXTURE: ", newFixture);
                    console.log("##################################");
                }

                if(that.shouldShowResponse()) {
                    console.log("RESPONSE: ", response);
                }

                if(callback) {
                    callback(newFixture, response);
                }
                done();
            }).catch((e)=>{
                that.error = e;
                done();
                //that.throwServerError(options);
            });
        });

        this.Describe.it(`should NOT error on ${methodType}: ${this.getRoute(methodType)}`, ()=>{
            if(that.error) {
                that.throwServerError({methodType: methodType, route: that.getRoute(methodType), fixture: changeFixture});
            }
            expect(that.error).to.be.null;
        });
    }

    throwServerError(opts) {
        var that = this;
        that.throwError(`${that.error.statusCode}: ${JSON.stringify(that.error.error)}`, opts);
    }

    callGET(changeFixture, callback, trimExcessArrayObjects){
        trimExcessArrayObjects = _.isUndefined(trimExcessArrayObjects) ? false : true;

        var that = this;
        this.callServer("GET", changeFixture, null, (fixture, response) =>{
            if(!that.getID()) {
                that.setIDFromResponse(response);
            }
            if(!fixture) {
                that.setFixture(response);
                fixture = response;
            }
            response = TestDataHandler.matchFixtureProperties(fixture, response, trimExcessArrayObjects);
            TestDataHandler.fixValuesForComparison(fixture, response);

            if(callback) {
                callback(fixture, response);
            }

            that.setFixture(fixture);

        });
        return this;
    }
    testGET(changeFixture){

        // Creating a pointer to fill in that expect tests can reference. Can't send fixture over on fn call
        // because it won't be in-sync with various edge cases.
        var testObj = {};

        this.callGET(changeFixture, (fixture, response)=>{
            testObj.fixture = fixture;
            testObj.response = response;
        }, true);

        var GetDescribe = new DescribeBlock("GET Response Tests");

        this.expectID(GetDescribe, testObj);
        this.expectKeys(GetDescribe, testObj);
        this.expectDataTypes(GetDescribe, testObj);

        this.Describe.describe(GetDescribe);
        return this;
    }
    callPOST(changeFixture, callback) {
        var that = this;

        var allowGET = this.allowGET();

        this.callServer("POST", changeFixture, null, (fixture, response) =>{
            that.setIDFromResponse(response);
            fixture[that.ID_PROP] = this.getID();
            if(!allowGET && callback){
                callback(fixture, response);
            }
            that.setFixture(fixture);
        });

        if(allowGET) {
            // Not sending changeFixture to GET because otherwise it'll run twice, which we don't want

           this.callGET(null, callback);
        }

        return this;
    }
    testPOST(changeFixture){

        // Creating a pointer to fill in that expect tests can reference. Can't send fixture over on fn call
        // because it won't be in-sync with various edge cases.
        var testObj = {};

        this.callPOST(changeFixture, (fixture, response) =>{
            testObj.fixture = fixture;
            testObj.response = response;
        });
        var text = "POST Test";
        if(this.allowGET()) {
            text = "POST/GET Test";
        }
        var PostDescribe = new DescribeBlock(text);

        this.expectID(PostDescribe, testObj);
        this.expectKeys(PostDescribe, testObj);
        this.expectDataTypes(PostDescribe, testObj);
        this.expectValueParity(PostDescribe, testObj);

        this.Describe.describe(PostDescribe);

        return this;

    }
    callPUT(changeFixture, callback){
        var that = this;

        var allowGET = this.allowGET();

        this.callServer("PUT", changeFixture, null, (fixture, response) =>{
            if(!allowGET && callback) {
                callback(fixture, response);
            }
            that.setFixture(fixture);
        });

        if(allowGET) {
            // Not sending changeFixture to GET because otherwise it'll run twice, which we don't want

            this.callGET(null, callback);
        }

        return this;


    }
    testPUT(changeFixture){

        // Creating a pointer to fill in that expect tests can reference. Can't send fixture over on fn call
        // because it won't be in-sync with various edge cases.
        var testObj = {};

        this.callPUT(changeFixture, (fixture, response) =>{
            testObj.fixture = fixture;
            testObj.response = response;

        });

        var text = "PUT Test";
        if(this.allowGET()) {
            text = "PUT/GET Test";
        }
        var PutDescribe = new DescribeBlock(text);

        this.expectID(PutDescribe, testObj);
        this.expectKeys(PutDescribe, testObj);
        this.expectDataTypes(PutDescribe, testObj);
        this.expectValueParity(PutDescribe, testObj);

        this.Describe.describe(PutDescribe);

        return this;


    }
    callDELETE(){
        return this;
    }
    testDELETE(){

        return this;
    }


    /*
        IT TESTS
     */
    expectID(Describe, testObj){
        var that = this;
        Describe.it("should have ID", ()=>{
            expect(testObj.response[that.ID_PROP]).to.be.a("number");
        });
    }
    expectKeys(Describe, testObj) {
        var that = this;
        Describe.it("should submit successfully", () => {
            expect(testObj.response).to.have.all.keys(testObj.fixture);
        });
    }
    expectDataTypes(Describe, testObj) {
        var that = this;
        Describe.it("should have the right property types", function(){

            var serverTypes = TestDataHandler.getDataTypeMap(testObj.response);
            var fixtureTypes = TestDataHandler.getDataTypeMap(testObj.fixture);

            expect(serverTypes).to.eql(fixtureTypes);
        });
    }
    expectValueParity(Describe, testObj) {
        var that = this;
        Describe.it("should equal fixture values", function(){
            expect(testObj.response).to.eql(testObj.fixture);
        });
    }
}

export default TestRest;
