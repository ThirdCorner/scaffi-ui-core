
import _ from 'lodash';

import chai from "chai";
import promised from "chai-as-promised";
chai.use(promised);
var expect = chai.expect;
import rp from 'request-promise';

import DescribeBlock from './common/describe-block';
import ScaffiCore from '../index';
var ID_PROP = ScaffiCore.config.getIdPropertyName();
var API_BASE = ScaffiCore.config.getApiBase();


//import TestSuiteForms from './TestSuiteForms';

import ExpectTests from './common/expect-tests';

import TestDataHandler from './common/test-data-handler';
//import TestRest from './TestRest';

function copy(obj){
    return JSON.parse(JSON.stringify(obj))
}

function fetchData(options) {
    return rp(options);
}

class TestSuite {
    /*
    TODO: Test that clearStorage is working between suite tests and single tests
        {
            allowedRest: ['GET', 'PUT'] etc GET, PUT, POST, DELETE
                If get is not allowed, PUT and POST assume success based on 200, rather than fetching list and making
                sure values got set.
            route: 'suppliers' (OPTIONAL)
                ( route to call for each test. Will be overriden if a different route is provided in individual test calls, like testPOST
                default:
                    GET: 'api/suppliers/1'
                    POST: 'api/suppliers'
                    PUT: 'api/suppliers/1'
                    DELETE: 'api/suppliers/1'
                    LIST: 'api/suppliers'
                )
            fixtures: {}
                Array of fixture collections and routes to run tests against
            ignoreProperties: []
                List of property names to ignore when changing values on PUT calls.
                ['ID', 'SandSupplier.Name']

            routeOpts: { // These are optional if testing via testFixtures. Provide these if you want to override global versions,
                    such as if you want to go to a different route for get than defaults
                GET: {
                    route: suppliers/:id
                    fixture: {}
                }
                POST: {
                    route: suppliers
                    fixture: {}
                }
                PUT: {
                    route: suppliers/:id
                    fixture: {}
                    ignoreProperties: [] - See above
                }
                DELETE: {
                    route: suppliers/2
                }

            }
        }
        restOpts: ['GET', 'PUT'] etc
     */
    constructor(opts){
        console.log("TETTTTTTTTTTTTTTTTT SUITE")
        this.opts = {
            allowedRest: ['GET', 'PUT', 'POST', 'DELETE', 'LIST']
        };

        Object.assign(this.opts, opts);

        if(this.opts.route) {
            var route = this.opts.route;
            var routes = {
                GET: {route: route + "/:id"},
                POST: {route: route},
                PUT: {route: route + "/:id"},
                DELETE: {route: route + "/:id"}
            };
            if(this.opts.routeOpts){
               var routeOpts = this.opts.routeOpts;
               this.opts.routeOpts = Object.assign(routes, routeOpts);

            } else {
                this.opts.routeOpts = routes;
            }
        }
        this.baseUrl = API_BASE;
        this.data = {};

        if(this.opts.fixtures) {
            this.addTest(this._generateFixturesTest(this.opts));
        }
    }

    _makeRouteOpts(opts, RESTType) {

        var newOpts = copy(this.opts);
        if(newOpts.routeOpts && _.has(newOpts.routeOpts, RESTType)) {
            newOpts = Object.assign(newOpts, newOpts.routeOpts[RESTType]);
        }
        if(opts) {
            newOpts = Object.assign(newOpts, opts);
        }

        return newOpts;
    }


    /*
        See above for explainations
        opts = {
            fixtures: []
            allowedRest: []
            route: ""
            ignoreProperties: []
            routeOpts
        }
     */
    testFixtures(opts){
       this.tests.push(this._generateFixturesTest(opts));
    }
    _generateFixturesTest(opts) {

        if(!opts) {
            opts = this.opts;
        }
        if(!opts.fixtures) {
            this.throwError("You must provide fixtures in arg opts in order to call testFixtures");
            return;
        }

        var Describe = new DescribeBlock("Testing Fixtures");
        _.each(opts.fixtures, function(fixture, name){
            if(name == 'COLLECTION') {
                var collectionOpts = copy(opts);
                collectionOpts.collection = fixture;
                Describe.describe("Testing Collections", this._generateCollectionsTest(collectionOpts));
            } else {
                var getOpts = this._makeRouteOpts(opts, "GET");
                Describe.describe("Testing GET route " + name, this._generateGETTest(getOpts));
            }
        }, this);

        return Describe;
    }
    /*
     See above for explainations
     opts = {
         collection: []
         allowedRest: []
         route: ""
         ignoreProperties: []
         routeOpts: {}
     }
     */
    testCollections(opts){
        this.tests.push(this._generateCollectionsTest(opts));
    }
    _generateCollectionsTest(opts) {
        var that = this;

        if(!_.isArray(opts.collection)) {
            this.throwError("testCollections must be provided a collection in its opts!", opts);
            return false;
        }

        var Describe = new DescribeBlock("Testing Collections");

        _.each(opts.collection, function(fixObj, index){
            var CollectDescribe = new DescribeBlock();
            Describe.describe("Collection #" + index, CollectDescribe);
            CollectDescribe.before(() => {
                that.clearDataStore();
            });

            opts.fixture = fixObj;

          //  var tr = new TestRest(opts);

            if(this.allowPOST(opts)) {
                CollectDescribe.describe("Testing POST Route",this._generatePOSTTest(null, false));
                if(this.allowPUT(opts)) {
                    CollectDescribe.describe("Testing PUT Route", this._generatePUTTest(null, false));
                }
            } else if(this.allowPUT(opts)) {
                CollectDescribe.describe("Testing PUT  Route", this._generatePUTTest(null, false));
            } else if(this.allowGET(opts)) {
                CollectDescribe.describe("Testing GET Route", this._generateGETTest(null, false));
            }
            CollectDescribe.after(()=>{
               that.clearDataStore();
            });

        }, this);


        return Describe;
    }
    /*
     See above for explainations
     opts = {
         fixture
         route: ""
     }
     */
    testGET(opts) {
        this.tests.push(this._generateGETTest(opts));
    }
    _generateGETTest(opts, clearTestMemory) {
        clearTestMemory = _.isUndefined(clearTestMemory) ? true : clearTestMemory;

        var getOpts = this._makeRouteOpts(opts, "GET");
        if(!getOpts.fixture && this.getData("fixture")) {
            console.log("!!!-----FILLING IN FIXTURE FROM STORAGE", this.getData("fixture"));
            getOpts.fixture = this.getData("fixture");
        }

        if(!getOpts.route || !getOpts.fixture) {
            this.throwError("Must provide a fixture and route to call testPUT with GET allowed", opts);
            return;
        }


        var Describe = new DescribeBlock();
        var fixture = copy(getOpts.fixture),
            fetchedData,
            that = this,
            id,
            error = null,
            options;

        Describe.before((done)=> {
            id = fixture[ID_PROP];
            if(!id) {
                this.throwError(`Your GET fixture must have an '${ID_PROP}' as a proprety.`, getOpts.fixture);
                return false;
            }

            options = {
                method: "GET",
                uri: this._getTestUrl(getOpts, id),
                json: true
            };

            fetchData(options).then((body)=> {
                fetchedData = body;
                TestDataHandler.matchFixtureProperties(fixture, fetchedData, true);
                TestDataHandler.fixValuesForComparison(fixture, fetchedData);
                this.setData("fixture", fetchedData);
                done();
            }).catch((e)=>{
                error = e;
                done();
            });

        });

        Describe.it("should NOT error on API calls", ()=>{
            if(error) {
                that.throwError(`${error.statusCode}: ${JSON.stringify(error.error)}`, options);
            }
            expect(error).to.be.null;
        });

        var GetDescribeText = "GET attempt";

        var GetDescribe = new DescribeBlock();
        Describe.describe(GetDescribeText, GetDescribe)

        GetDescribe.it("should have ID", ()=>{
            expect(id).to.be.a("number");
        });

        GetDescribe.it("should submit successfully", () => {
            expect(fetchedData).to.have.all.keys(fixture);
        });

        GetDescribe.it("should have the right property types", function(){
            var serverTypes = TestDataHandler.getDataTypeMap(fetchedData);
            var fixtureTypes = TestDataHandler.getDataTypeMap(fixture);

            expect(serverTypes).to.eql(fixtureTypes);
        });

        if(clearTestMemory) {
            Describe.after(function(){
                that.clearDataStore();
            });
        }


        return Describe;
    }
    /*
        opts = {
            fixture: {},
            route: ""
            routeOpts: {}
            allowedRest: []
            ignoreProperties: []
        }
     */
    testPUT(opts) {
       this.tests.push(this._generatePUTTest(opts));

    }
    _generatePUTTest(opts, clearTestMemory) {
        clearTestMemory = _.isUndefined(clearTestMemory) ? true : clearTestMemory;

        var putOpts = this._makeRouteOpts(opts, "PUT");

        if(!putOpts.fixture && this.getData("fixture")) {
            console.log("!!!-----FILLING IN FIXTURE FROM STORAGE", this.getData("fixture"));
            putOpts.fixture = this.getData("fixture");
        }

        if(!putOpts.route || !putOpts.fixture) {
            console.log(putOpts);
            this.throwError("Must provide a fixture and route to call testPUT", putOpts);
            return;
        }
        var getOpts;
        if(this.allowGET(opts)) {
            getOpts = this._makeRouteOpts(opts, "GET");
            if(!getOpts.fixture && putOpts.fixture) {
                getOpts.fixture = putOpts.fixture;
            }
            if(!getOpts.route || !getOpts.fixture) {
                this.throwError("Must provide a fixture and route to call testPUT with GET allowed", getOpts);
                return;
            }
        }

        var Describe = new DescribeBlock();
        var putFixture,
            putFetchedData,
            that = this,
            allowGET = this.allowGET(opts),
            id,
            error = null,
            options;

        Describe.before((done)=> {
            id  = that.getData("POST:id") || putOpts.fixture[ID_PROP];

            if(!id) {
                this.throwError(`POST is not allowed and collection does not have an id so could not perform a PUT test. Expecting '${ID_PROP}' for the id property name.`, putOpts.fixture);
                return false;
            }
            putFixture = TestDataHandler.changeDataBasedOnType(copy(putOpts.fixture), putOpts.ignoreProperties);
            putFixture[ID_PROP] = id;
            options = {
                method: "PUT",
                form: putFixture,
                uri: this._getTestUrl(putOpts, id),
                json: true
            };

            fetchData(options).then((body) => {

                if(allowGET && id) {

                    options = {
                        method: "GET",
                        uri: this._getTestUrl(getOpts, id),
                        json: true
                    };
                    fetchData(options).then((body)=> {
                        putFetchedData = body;
                        TestDataHandler.matchFixtureProperties(putFixture, putFetchedData);
                        TestDataHandler.fixValuesForComparison(putFixture, putFetchedData);
                        this.setData("fixture", putFetchedData);
                        done();
                    }).catch((e)=>{
                        error = e;
                        done();
                    });
                } else if(body) {
                    putFetchedData = putFixture;
                    this.setData("fixture", putFixture);
                    done();
                } else {
                    done();
                }
            }).catch((e)=>{
                error = e;
                done();
            });

        });

        Describe.it("should NOT error on API calls", ()=>{
            if(error) {
                that.throwError(`${error.statusCode}: ${JSON.stringify(error.error)}`, options);
            }
            expect(error).to.be.null;
        });

        var PutDescribeText = "PUT attempt";
        if(allowGET) {
            PutDescribeText = "PUT/GET attempt";
        }



        var PutDescribe = new DescribeBlock();
        Describe.describe(PutDescribeText, PutDescribe);

        PutDescribe.it("should have ID", ()=>{
            expect(id).to.be.a("number");
        });

        PutDescribe.it("should submit successfully", () => {
            expect(putFetchedData).to.have.all.keys(putFixture);
        });

        PutDescribe.it("should have the right property types", function(){
            var serverTypes = TestDataHandler.getDataTypeMap(putFetchedData);
            var fixtureTypes = TestDataHandler.getDataTypeMap(putFixture);

            expect(serverTypes).to.eql(fixtureTypes);
        });

        PutDescribe.it("should equal fixture values", function(){
            expect(putFetchedData).to.eql(putFixture);
        });

        if(clearTestMemory) {
            Describe.after(function(){
                that.clearDataStore();
            });
        }


        return Describe;

    }
    /*
     opts = {
         fixture: {},
         route: ""
         routeOpts: {}
         allowedRest: []
         ignoreProperties: []
     }
     */
    testPOST(opts, describe) {
        this.tests.push(this._generatePOSTTest(opts));

    }
    _generatePOSTTest(opts, clearTestMemory) {
        clearTestMemory = _.isUndefined(clearTestMemory) ? true : clearTestMemory;

        var postOpts = this._makeRouteOpts(opts, "POST");
        if(!postOpts.fixture && this.getData("fixture")) {
            console.log("!!!-----FILLING IN FIXTURE FROM STORAGE", this.getData("fixture"));
            postOpts.fixture = this.getData("fixture");
        }

        if(!postOpts.route || !postOpts.fixture) {
            this.throwError("Must provide a fixture and route to call testPOST", opts);
            return;
        }

        var getOpts;
        if(this.allowGET(opts)) {
            getOpts = this._makeRouteOpts(opts, "GET");
            if(!getOpts.fixture && postOpts.fixture) {
                getOpts.fixture = postOpts.fixture;
            }
            if(!getOpts.route || !getOpts.fixture) {
                this.throwError("Must provide a fixture and route to call testPUT with GET allowed", opts);
                return;
            }
        }


        var Describe = new DescribeBlock();
        var fixture = copy(postOpts.fixture),
            fetchedData,
            that = this,
            allowGET = this.allowGET(opts),
            id,
            error = null,
            options;

        Describe.before((done)=> {

            delete fixture[ID_PROP];
            options = {
                method: "POST",
                form: fixture,
                uri: this._getTestUrl(postOpts),
                json: true
            };
            fetchData(options).then((body) => {
                if (_.isObject(body) && body[ID_PROP]) {
                    id = body[ID_PROP];
                    fetchedData = body;
                    this.setData("fixture", fetchedData);
                } else if (_.isNumber(body)) {
                    id = body;
                    fetchedData = fixture;
                    this.setData("fixture", fetchedData);
                }

                that.setData("POST:id", id);


                if (allowGET && id) {
                    options = {
                        method: "GET",
                        uri: this._getTestUrl(getOpts, id),
                        json: true
                    };

                    fetchData(options).then((body)=> {
                        fixture[ID_PROP] = id;
                        fetchedData = body;
                        TestDataHandler.matchFixtureProperties(fixture, fetchedData);
                        TestDataHandler.fixValuesForComparison(fixture, fetchedData);
                        this.setData("fixture", fetchedData);
                        done();
                    }).catch((e)=>{
                        error = e;
                        done();
                    });
                } else {
                    done();
                }

            }).catch((e)=>{
                error = e;
                done();
            });
        });

        Describe.it("should NOT error on API calls", ()=>{
            console.log(error);
            if(error) {
                that.throwError(`${error.statusCode}: ${JSON.stringify(error.error)}`, options);
            }
            expect(error).to.be.null;
        });

        var PostDescribeText = "POST attempt";
        if(allowGET) {
            PostDescribeText = "POST/GET attempt";
        }



        var PostDescribe = new DescribeBlock();
        Describe.describe(PostDescribeText, PostDescribe)

        PostDescribe.it("should have ID", ()=>{
            expect(id).to.be.a("number");
        });

        PostDescribe.it("should submit successfully", () => {
            expect(fetchedData).to.have.all.keys(fixture);
        });

        PostDescribe.it("should have the right property types", function(){
            var serverTypes = TestDataHandler.getDataTypeMap(fetchedData);
            var fixtureTypes = TestDataHandler.getDataTypeMap(fixture);
            expect(serverTypes).to.eql(fixtureTypes);
        });

        PostDescribe.it("should equal FIXTURE values", function(){
            expect(fetchedData).to.eql(fixture);
        });

        if(clearTestMemory) {
            Describe.after(function(){
                that.clearDataStore();
            });
        }


        return Describe;
    }

    throwError(errorMsg, data) {
        console.log("============ERROR============");
        console.log("MSG: ", errorMsg);
        if(data) {
            console.log("DATA: ", data);
        }
        console.log("=============================");
        throw errorMsg;
    }
    clearDataStore(){
        this.data = {};
    }
    getData(name) {
        return this.data[name] || null;
    }
    setData(name, value) {
        this.data[name] = value;
    }
    _getTestUrl(opts, id) {
        if(!opts.route) {
            this.throwError("You must set an opts.route for this specific test!", opts);
        }
        var url = this.baseUrl + opts.route;
        if(id && url.indexOf(":id") !== -1) {
            url = url.replace(":id", id);
        }
        return url;
    }
    _checkAllowed(opts, RESTOpts) {
        if(!opts || !opts.allowedRest) {
            return true;
        }
        return opts.allowedRest.indexOf(RESTOpts) !== -1;
    }
    allowGET(opts){
        return this._checkAllowed(opts, "GET");
    }
    allowPOST(opts){
        return this._checkAllowed(opts, "POST");
    }
    allowPUT(opts){
        return this._checkAllowed(opts, "PUT");
    }
    allowDELETE(opts){
        return this._checkAllowed(opts, "DELETE");
    }
    allowLIST(opts){
        return this._checkAllowed(opts, "LIST");
    }

    /*
        Each object in the REST properties is what you're expecting back, in case
        something gets changed between post and get etc
        {
            POST: {}
            GET: {}
            PUT: {}
            DELETE: {}

            Exclude any you don't want to test. Don't worry about the id property
        }
     */
    /*
        sequenceArr: [
              Row of routeOpts from above done in sequence so you can start with one structure and then test to
              make sure the structure changes
              {
                type: "POST",
                route: "wells", (optional if provided in constructor
                fixture: {},
                ignoreProperties [] (optional if provided above)
              }
        ]
     */
    //testRESTSequence(describe, sequenceArr) {
    //    if(!_.isArray(sequenceArr)) {
    //        throw "testRESTSequence takes an array. An array was not given.";
    //    }
    //    var Describe = new DescribeBlock(describe);
    //    _.each(sequenceArr, function(restOpts){
    //        if(!restOpts.type) {
    //            throw "You must provide a type in each testRESTSequence objects.";
    //        }
    //
    //        var name = "_generate" + restOpts.type.toUpperCase() + "Test";
    //        Describe.describe("", [name](restOpts));
    //
    //    }, this);
    //    this.tests.push(Describe);
    //}
}
export default TestSuite;
