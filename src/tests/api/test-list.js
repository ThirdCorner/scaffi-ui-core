import _ from 'lodash';

import chai from "chai";
import promised from "chai-as-promised";
chai.use(promised);
var expect = chai.expect;
import rp from 'request-promise';

import TestDataHandler from '../common/test-data-handler';
import TestRest from './test-rest';
import DescribeBlock from '../common/describe-block';

import ScaffiCore from '../../index';
class TestList extends TestRest {
    ensureListHasTestableStructures(opts){
        if(!this.ensureTableStructure) {
            var that = this;

            this.callLIST(null, this.makeFilterParam(opts, {}), (fixture, response)=> {
                var limit = opts.count || 3;
                if (!_.isObject(response) || !_.has(response, "results") || !_.has(response, "inlineCount")) {
                    that.throwError("LIST response must be an object with count and results defined as properties!", response);
                }
                if (!response.results || (response.results.length < limit && !that.allowPOST() )) {
                    that.throwError(`LIST results is less than ${limit} and can't POST! Need more data.`, response);
                }
                if (!response.results.length && !opts.fixture) {
                    that.throwError("LIST isn't returning any results and no fixture is declared for insertion", response);
                }

                if (response.results.length < limit) {
                    for(var i = response.results.length; i <= limit; i++) {
                        var fixture = opts.fixture || response.results[0];
                        that.callPOST(fixture);
                    }
                }

            });
            this.ensureTableStructure = true;
        }
    }
    ensureSeedData(opts, fixture, getOptsColumns) {
        var that = this;
        if(!_.isObject(getOptsColumns)) {
            this.throwError("testFilter in LIST tests must be an object mapping filter name to actual object property", opts);
        }
        if(!fixture) {
            this.throwError("You must provide a fixture so that testFilter can figure out data types", opts);
        }

        var testFixture = this.copy(fixture);
        _.each(getOptsColumns, (columnName, filterName) =>{

            if(columnName == that.ID_PROP) {
                return;
            }
            if(!_.has(testFixture, columnName)) {
                that.throwError(`testLIST filter does not have LIST fixture column ${columnName}`, testFixture);
            }
            if(_.isNull(testFixture[columnName])) {
                that.throwError(`testList filter column '${columnName}' value in fixture is null. Can't properly test without value!`, testFixture);
            }


            testFixture[columnName] = TestDataHandler.changeValueBasedOnType(testFixture[columnName]);
        });
        if(this.allowPOST()) {
            this.callPOST(testFixture, (fixture, response)=> {
                that.ensureLockedValuesTransfer(testFixture, response);
            });
        }
        else if(this.allowPUT()) {
            this.callPUT(testFixture, (fixture, response)=>{
                that.ensureLockedValuesTransfer(testFixture, response);
            });

        }
        else {
            this.throwError("Could not plant seed data for testLIST testFilter because POST and PUT is disabled.", opts);
        }

        return testFixture;

    }
    ensureLockedValuesTransfer(fixture, response) {
        var lockedColumns = [this.ID_PROP, "CreatedOn", "CreatedDate", "ModifiedOn", "ModifiedDate"];
        _.each(lockedColumns, function(colName) {
            if(_.has(response, colName)) {
                fixture[colName] = response[colName];
            }
        }, this);

    }


    callLIST(changeFixture, params, callback){
        var that = this;

        this.callServer("LIST", changeFixture, params, (fixture, response) =>{

            if(callback) {
                callback(fixture, response);
            }

        });

        return this;
    }
    makeFilterParam(opts, param) {
        if(opts.filter) {
            _.each(opts.filter, (value,key)=>{
                param[key] = value;
            }, this);
        }
        this.makeParam(opts, param);

        return param;
    }
    makeParam(opts, param) {
        // Setting a default count and page because that's what the table component always sends
        if(!_.has(param, "count")) {
            param.count = 99;
        }
        if(!_.has(param, "page")) {
            param.page = 1;
        }
        return param;
    }
    testLIST(opts){
        if(opts.debug) {
            this.enableDebugging();
        }
        var that = this;
        var Describe = new DescribeBlock("LIST Tests");

        this.ensureListHasTestableStructures(opts);
        var limit = opts.count || 2;



        if(opts.testCount){

            var CountDescribe = new DescribeBlock("Test param: count");

            var testCount = {};

            this.callLIST(null, this.makeFilterParam(opts, {count: 2}), (fixture, response)=>{
                testCount.response = response;
            });

            that.expectCountToFilter(CountDescribe, 2, testCount);
            Describe.describe(CountDescribe);


        }
        if(opts.testPagination) {
            if(!opts.testCount && !opts.count) {
                this.throwError("You either need to allow count testing or provide a count property that the server is set for! EX: count: 20", opts);
            }

            var PageDescribe = new DescribeBlock("Test param: page");

            var testPageObj = {};

            this.callLIST(null, this.makeFilterParam(opts, {count: limit}), (fixture, response)=>{
                testPageObj.responsePageOne = response;

            });

            this.callLIST(null, this.makeFilterParam(opts, {count: limit, page: 2}), (fixture, response)=>{
                testPageObj.responsePageTwo = response;
            });

            that.expectDifferentResponses(PageDescribe, testPageObj);
            Describe.describe(PageDescribe);

        }
        if(opts.testFilter) {
            var testFixture = this.ensureSeedData(opts, opts.fixture, opts.testFilter);
            var testFilterObj = {seedFixture: testFixture};

            // For PStar, you have to provide a filter so we can't test the count
            //this.callLIST(null, this.makeFilterParam(opts, {}), (fixture, response)=>{
            //   testFilterObj.initialCount = response.results.length;
            //
            //});

            _.each(opts.testFilter, (columnName, filterName) =>{

                var seedValue = testFixture[columnName];
                var TestFilterDescribe = new DescribeBlock(`Testing param: filter/${columnName}`);
                that.callLIST(null, this.makeParam(opts,{[filterName]: seedValue}), (fixture, response) =>{
                    testFilterObj[filterName] = response;
                });
                that.expectResultsToFilter(TestFilterDescribe, filterName, columnName, testFilterObj);

                Describe.describe(TestFilterDescribe);

            }, this);
        }
        if(opts.testSorting) {
            var testSortFilterObj = {seedFixture: this.ensureSeedData(opts, opts.fixture, opts.testSorting)};

            _.each(opts.testSorting, (columnName, sortName) =>{

                    var TestSortDescribe = new DescribeBlock(`Testing param: sort/${columnName}`);
                    that.callLIST(null, this.makeFilterParam(opts, {sortProperty: columnName, sortDirection: "asc"}), (fixture, response) =>{
                        testSortFilterObj[sortName] = {
                            "asc": response
                        };
                    });
                    that.callLIST(null, this.makeFilterParam(opts, {sortProperty: columnName, sortDirection: "desc"}), (fixture, response) =>{
                        testSortFilterObj[sortName]["desc"] = response;
                    });
                    that.expectResultsToSort(TestSortDescribe, sortName, testSortFilterObj);

                    Describe.describe(TestSortDescribe);

            }, this);
        }

        this.Describe.describe(Describe);
        return this;
    }

    expectCountToFilter(Describe, pageLimit, testObj) {
        var that = this;
        Describe.it(`should have inlineCount != ${pageLimit}`, ()=>{
            expect(testObj.response.inlineCount).to.not.equal(pageLimit);
        });
        Describe.it(`should have ${pageLimit} LIST results`, ()=>{
            expect(testObj.response.results).to.have.length(pageLimit);
        });
        Describe.it("should limit results to inlineCount", ()=>{
            expect(testObj.response.inlineCount).to.be.a("number");
            expect(testObj.response.results).to.be.a("array");
            expect(testObj.response.results).to.have.length.below(testObj.response.inlineCount);
        });
        Describe.it("results should equal filter limit count", ()=>{
           expect(testObj.response.results).to.have.length(pageLimit);
        });
    }
    expectDifferentResponses(Describe, testObj){
        var that = this;
        Describe.it("page1 should have LIST response and results", ()=>{
            expect(testObj.responsePageOne).to.have.property("inlineCount");
            expect(testObj.responsePageOne).to.have.property("results");
            expect(testObj.responsePageOne.results).to.have.length.above(0);
        });
        Describe.it("page2 should have LIST response and results", ()=>{
            expect(testObj.responsePageTwo).to.have.property("inlineCount");
            expect(testObj.responsePageTwo).to.have.property("results");
            expect(testObj.responsePageTwo.results).to.have.length.above(0);
        });
        Describe.it("should have page result IDs that don't match", ()=>{
            var page1ID = testObj.responsePageOne.results[0][that.ID_PROP];
            var page2ID = testObj.responsePageTwo.results[0][that.ID_PROP];
            expect(page1ID).to.be.a("number");
            expect(page2ID).to.be.a("number");
            expect(page1ID).to.not.equal(page2ID);
        });
    }
    expectResultsToFilter(Describe, filterName, columnName, testObj) {
        var that = this;

        Describe.it(`filter: ${filterName} should have results`, ()=>{
            expect(testObj[filterName].results).to.have.length.above(0);
        });
        //Describe.it(`filter: ${filterName} results should be less than initial call`, ()=>{
        //   expect(testObj[filterName].results).to.have.length.below(testObj.initialCount);
        //});
        Describe.it(`filter: ${filterName} results should have seed value`, ()=>{
            var testValue = testObj.seedFixture[columnName];
            _.each(testObj[filterName].results, (result) =>{
                var checkValue = TestDataHandler.fixValueStructure(testValue, result[columnName]);
                expect(checkValue).to.equal(testValue);
            }, this);
        });
    }
    expectResultsToSort(Describe, sortProperty, testObj) {
        var that = this;

        Describe.it(`sort: ${sortProperty} asc should have results`, ()=>{
           expect(testObj[sortProperty]["asc"].results).to.have.length.above(0);
        });
        Describe.it(`sort: ${sortProperty} desc should have results`, ()=>{
            expect(testObj[sortProperty]["desc"].results).to.have.length.above(0);
        });
        Describe.it(`sort: ${sortProperty} asc/desc top row should be different via the ID`, ()=>{
            var ascID = testObj[sortProperty]["asc"].results[0][that.ID_PROP];
            var descID = testObj[sortProperty]["desc"].results[0][that.ID_PROP];

            expect(descID).to.not.equal(ascID);
        });
    }
}

export default TestList
