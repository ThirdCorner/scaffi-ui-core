
import ParserHelper from '../../helpers/parser-helper';
import _ from 'lodash';
import moment from 'moment';

import ScaffiCore from '../../index';

class TestDataHandler {
    constructor(){
        this.ID_PROP = ScaffiCore.config.getIdPropertyName();
    }
    randomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 7; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;

    }

    getDataType(value) {
        switch(true) {
            case _.isNull(value):
            case _.isUndefined(value):
                return null;
            case ParserHelper.isObject(value):
                return "object";
                break;
            case ParserHelper.isContainer(value):
                return "array";
                break;
            case ParserHelper.isDateString(value):
                return "date";
                break;
            default:
                return typeof value;
        }
    }
    getDataTypeMap(data){
        var returnData = {};
        _.each(data, function(value,key) {

            if(ParserHelper.isContainer(value)) {
                if(_.isArray(value)) {
                    returnData[key] = [];
                    _.each(value, function(obj){
                        returnData[key].push(this.getDataTypeMap(obj));
                    }, this);
                } else {
                    returnData[key] = this.getDataTypeMap(value);
                }
            } else {
                returnData[key] = this.getDataType(value);
            }

        }, this);

        return returnData;
    }
    matchFixtureDataStructure(fixtureValue, changeValue) {
        changeValue = ParserHelper.convertToNumber(changeValue);
        if(_.isNumber(changeValue) && _.isNumber(fixtureValue)){

            if(fixtureValue.toString().indexOf('.') !== -1) {
                var percision = fixtureValue.toString().length - (fixtureValue.toString().indexOf('.') + 1);
                changeValue = parseFloat(changeValue.toFixed(percision));
            }
        }

        return changeValue;
    }
    copy(obj){
        return JSON.parse(JSON.stringify(obj))
    }

    excludeProperties(arrOfProperties, structure) {
        structure = this.copy(structure);

        var that = this;
        function deepRemoveSearch(structure, key) {
            if(key.indexOf(".") === -1) {
                if(_.has(structure, key) || key == that.ID_PROP) {
                    delete structure[key];
                }
                return;
            }

            var keys = key.split(".");
            var baseKey = keys.shift();
            key = keys.join(".");
            if(!_.has(structure, baseKey)) {
                return;
            }

            if(_.isArray(structure, baseKey)) {
                _.each(structure[baseKey], function(arrItem){
                    deepRemoveSearch(arrItem, key);
                }, this);
            } else {
                deepRemoveSearch(structure[baseKey], key);
            }

        }
        _.each(arrOfProperties, function(propName){
            deepRemoveSearch(structure, propName);

        });

        return structure;
    }

    /*
        This takes an object and removes any extranious properties we're not testing on
        so that we can say expect(testObj).to.have.all.keys(fixture) and have it pass, even if the server
        is sending back a property we don't care about.
        shouldSquashExtraArrayEntries : bool if set to true, it will truncate any array entries that aren't in the fixture.
        This is because, if you're just checking that the array has types, you don't care if it has extra array objects.
     */
    matchFixtureProperties(fixture, testObj, shouldSquashExtraArrayEntries) {
        shouldSquashExtraArrayEntries = _.isUndefined(shouldSquashExtraArrayEntries) ? false : shouldSquashExtraArrayEntries;

        var retValues;
        if(_.isArray(testObj)) {
            retValues = [];
        } else {
            retValues = {};
        }
        _.each(testObj, function(value, name){
            if(!_.has(fixture, name)) {
                if(!_.isArray(testObj) || (_.isArray(testObj) && shouldSquashExtraArrayEntries)) {
                    return;
                }
            }

            retValues[name] = value;

            /*
                This was relying on passing by value, but then things weren't getting trimmed so
                we're setting it in a new object and returning it.
             */
            if(ParserHelper.isContainer(value)){
                retValues[name] = this.matchFixtureProperties(fixture[name], retValues[name], shouldSquashExtraArrayEntries);
            }
        }, this);

        return retValues;
    }

    /*
        This makes some change assumptions to certain value types so that values can be compared successfully.
        Mainly, this deals with datestrings so that you can compare a fixture date with the usual datetime that
        comes back from the server.
     */
    fixValuesForComparison(fixture, fetchedData){
        _.each(fixture, function(value,key){
            if(ParserHelper.isContainer(value) && _.has(fetchedData, key)){
                this.fixValuesForComparison(fixture[key], fetchedData[key]);
                return;
            } else {
                if(!_.has(fetchedData, key)) {
                    return;
                }
                fetchedData[key] = this.fixValueStructure(value, fetchedData[key]);
            }
        }, this);

    }
    fixValueStructure(referenceValue, changeValue) {
        switch(true) {
            case  ParserHelper.isDateString(referenceValue) && !ParserHelper.isDateTimeString(referenceValue) && ParserHelper.isDateTimeString(changeValue):
                changeValue = ParserHelper.convertToDateString( changeValue );
                break;
        }

        return changeValue;
    }
    changeValueBasedOnType(value) {
        switch(this.getDataType(value)){
            case "date":
                return ParserHelper.convertToDateString(moment(value).subtract(2, "days").subtract(1, "month"));
                break;
            case "boolean":
                return !value;
                break;
            case "number":
               return value + Math.floor((Math.random() * 10) + 1);
                break;
            case "string":
                return this.randomString();
                break;
            case "null":
            case null:
                return null;
                break;
            default:
                console.log(value);
                throw "Could not change the value of " + value + " because do not recognize its type of " + this.getDataType(value);
        }
    }
    /*
        This takes a data structuer, usually a fixture, and changes the data so that we can test that puts were successful.
        ignoreArr is an ["propertyName] structure so you can tell the function which properties not to change, such as CreatedOn
        It takes dot notated properties "SandSupplier.Name" for nested structures.
        It also takes care of ID for you.
     */
    changeDataBasedOnType(dataObj, ignoreArr){

        if(!ignoreArr || !_.isArray(ignoreArr)) {
            ignoreArr = [];
        }
        if(ignoreArr.indexOf(this.ID_PROP) === -1) {
            ignoreArr.push(this.ID_PROP);
        }


        _.each(dataObj, function(value, key){
            if(ParserHelper.isContainer(value)){
                var newIgnores = [];
                _.each(ignoreArr, function(ignore){
                    // This looks for nested ignores
                    if(ignore.indexOf(".") !== -1 && ignore.indexOf(key) === 0) {
                        newIgnores.push(ignore.substr( ignore.indexOf(".") + 1  ));
                    }

                }, this);

                this.changeDataBasedOnType(dataObj[key], newIgnores);
            } else if(ignoreArr.indexOf(key) === -1){
                dataObj[key] = this.changeValueBasedOnType(dataObj[key]);
            }



        }, this);

        return dataObj;
    }


}

export default new TestDataHandler();
