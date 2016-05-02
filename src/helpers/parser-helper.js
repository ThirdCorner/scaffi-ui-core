
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
        if(_.isString(value) && !isNaN(value)){
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
    isFormController(item, name) {
        return (_.endsWith(name, "Form") && _.has(item, "$submitted")); 
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

                    if(name !== "_form") {
                        name = "_form";
                        $parent[name] = value;
                    }
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
                    structure[key] = moment(value).format('YYYY-MM-DD');
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
                    case ParserHelper.isNumberString(value):
                        structure[key] = ParserHelper.convertToNumber(value);
                        break;
                    // Try as a date
                    case ParserHelper.isDateString(value):
                        structure[key] = moment(value).toDate();
                        break;

                }

            }
        }, this);
        return structure;
    }
};

export default ParserHelper;