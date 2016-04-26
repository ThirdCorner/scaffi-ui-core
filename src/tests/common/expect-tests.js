import chai from "chai";
import promised from "chai-as-promised";
chai.use(promised);
var expect = chai.expect;

import TestDataHandler from './test-data-handler';

function throwError(errorMsg, data){
    console.log("============ERROR============");
    console.log("MSG: ", errorMsg);
    if(data) {
        console.log("DATA: ", data);
    }
    console.log("=============================");
    throw errorMsg;
}

var Tests = {
    ShouldNot: {
        ErrorOnAPI(describe, error, opts){
            describe.it("should NOT error on API calls", ()=>{
               if(error) {
                   throwError(`${error.statusCode}: ${error.error}`, opts);
               }
               expect(error).to.be.null;
            });
        },
        ErrorOnPage(describe) {
            describe.it("should NOT have error'd", ()=>{
                expect(element(by.id('test-ui-harness')).element(by.className("error")).isPresent()).to.eventually.be.false;
            })
        }
    }

};

export default Tests;