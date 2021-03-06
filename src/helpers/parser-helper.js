
import _ from 'lodash';
import moment from 'moment';
var ParserHelper = {};
ParserHelper = {
    isContainer(value){
        return _.isArray(value) || (_.isObject(value) && Object.prototype.toString.call(value) == "[object Object]");
    },
    isObject(value){
        return Object.prototype.toString.call(value) == "[object Object]";
    },
    isDate(value) {
        return Object.prototype.toString.call(value) == "[object Date]";
    },
    isNumberString(value){
        /*
            We're checking for 0 pad because that means we don't want to convert to a number
         */
        if(_.isString(value) && value.length > 0 && !isNaN(value) && value[0] !== "0"){
            return true;
        }
        return false;
    },
    isDateString(date) {

        if(!date) {
            return false;
        }

        if(!isNaN(Number(date))) {
            return false;
        }

        if ( !_.isNumber(date) && (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) )
            && (moment(date).format().indexOf(date) !== -1 || date.match(/^\d+-\d+-\d+T\d+:\d+:\d+/) )) {
            return true;
        }

        return false;

    },
    isFormController(item) {
        return item && item.constructor && item.constructor.name === "FormController";
    },
    getFormController($scope) {
        var form;
        _.each($scope, (value, name)=>{
            if(this.isFormController(value, name)) {
                form = $scope[name];
            }
        }, this);
        
        if(form) {
           return form; 
        }
        
        if($scope.$parent) {
            return this.getFormController($scope.$parent);
        }
        
        return null;
    },
    setFormInChildScope($scope, $parent){
        if($scope && $parent) {
            var setForm = false;
            _.each($parent, (value, name)=> {
                if (this.isFormController(value, name)) {
                    $scope[name] = value;
                    setForm = true;
                }
            }, this);
            
            if(setForm) {
               return true; 
            }
            
            if($parent.$parent) {
                this.setFormInChildScope($scope, $parent.$parent);
            }
        }
        return false;
    },
    convertToNumber(value) {
        if(ParserHelper.isNumberString(value)) {
            if(value.indexOf('.') !== -1) {
                return parseFloat(value);
            } else {
                return parseInt(value, 10);
            }
        }

        return value;
    },
    isDateTimeString(value){
        if(!value) {
            return false;
        }

        if(!isNaN(Number(value))) {
            return false;
        }

        return value.match(/^\d+-\d+-\d+T\d+:\d+:\d+/) ? true : false;

    },
    getValueWithNestedKey(obj, key){
        if(key.indexOf(".")) {
            // Need to deal with arrays
            var keys = key.split(".");
            var lastHash = keys.pop();
            while(key = keys.shift()) {

                if(_.isString(key) && key.indexOf("[") === 0) {
                    key = key.replace("[", "").replace("]", "");
                    key = parseInt(key, 10);
                }

                if(!_.has(obj, key) ) {
                    return null;
                }

                obj = obj[key];
            }
            key = lastHash;
        }
        if (_.has(obj, key)) {
            return obj[key];
        }

        return null;
    },
    /*
     Array keys need to have brackets
     FreightVendors.[0].Name
     */
    setObjectWithNestedKey(obj, key, value) {

        if(key.indexOf(".")) {
            // Need to deal with arrays
            var keys = key.split(".");
            var lastHash = keys.pop();
            for(var i = 0; i < keys.length; i++) {
                let keyPointer = keys[i];

                if(_.isString(keyPointer) && keyPointer.indexOf("[") === 0) {
                    keyPointer = keyPointer.replace("[", "").replace("]", "");
                    keyPointer = parseInt(keyPointer, 10);
                }

                if(!_.has(obj, keyPointer) || !_.isObject(obj[keyPointer])) {

                    var newObj = {};
                    var nextKey = i + 1;

                    if(keys.length > nextKey && _.isString(keys[nextKey]) && keys[nextKey].indexOf("[") === 0) {
                        newObj = [];
                    }


                    obj[keyPointer] = newObj;

                }

                obj = obj[keyPointer];
            }

            //obj[lastHash] = {};
            key = lastHash;
        }

        obj[key] = value;


        return true;
    },
    /*
        Loops through an object and converts any date objects to date strings
     */
    convertToDateStrings(obj) {

        if(!ParserHelper.isContainer(obj)) {
            return obj;
        }

        _.each(obj, function(value, key){

            if(ParserHelper.isContainer(value)){
                ParserHelper.convertToDateStrings(value);

            }

            if(_.isDate(value)) {
                obj[key] = moment(value).format('YYYY-MM-DD');
            }

        }, this);

    },
    convertToDateString(datevalue){
        var date = datevalue;
        //if(this.isDateString(datevalue)) {
        //    date = new Date(datevalue);
        //
        //}

        if(date instanceof moment) {
            return date.format("YYYY-MM-DD");
        }

        return moment(date).format("YYYY-MM-DD");
    },
    convertToDB(structure){

        if(!ParserHelper.isContainer(structure)) {
            return structure;
        }
        _.each(structure, function(value, key){
            switch(true) {
                case ParserHelper.isContainer(value):
                    ParserHelper.convertToDB(value);
                    break;
                case ParserHelper.isDate(value):
                    structure[key] = moment(value).format();
                    break;
                case !_.isObject(value):
                    break;
                default:
                    console.log("Couldn't convert " + Object.prototype.toString.call(value), value);
                    throw new Error("Couldn't convert " + Object.prototype.toString.call(value) + " in your api send!");

            }
        }, this);

        return structure;
    },
    convertToApp(structure){
        if(!ParserHelper.isContainer(structure)) {
            return structure;
        }
        _.each(structure, function(value, key){

            if(ParserHelper.isContainer(value)) {
                ParserHelper.convertToApp(value);
            } else {
                switch(true) {
                    /*
                     If we have an empty string, converting to null so we only 
                     ever have to check for nulls
                     */
                    case _.isString(value) && value.length == 0:
                        structure[key] = null;
                        break;
                    case ParserHelper.isNumberString(value):
                        structure[key] = ParserHelper.convertToNumber(value);
                        break;
                    // Try as a date
                    case ParserHelper.isDateString(value):
                        /*
                            Check if just a date, in which case we need to handle differently
                            We want to do this so that 2016-02-10 gets set properly, otherwise
                            it usually ends up as 2016-02-10 because of timezone issues.
                            
                         */
                        if(value.indexOf("T") === -1 && value.indexOf("-") !== -1) {
                            var split = value.split("-");
                            structure[key] = moment(new Date())
                                .year(split[0])
                                .month(parseInt(split[1],10) - 1)
                                .date(split[2]).toDate();
                        }  else {
                            structure[key] = new Date(value);
                        }
                        break;

                }

            }
        }, this);
        return structure;
    }
};

export default ParserHelper;