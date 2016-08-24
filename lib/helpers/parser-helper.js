'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ParserHelper = {};
ParserHelper = {
    isContainer: function isContainer(value) {
        return _lodash2.default.isArray(value) || _lodash2.default.isObject(value) && Object.prototype.toString.call(value) == "[object Object]";
    },
    isObject: function isObject(value) {
        return Object.prototype.toString.call(value) == "[object Object]";
    },
    isDate: function isDate(value) {
        return Object.prototype.toString.call(value) == "[object Date]";
    },
    isNumberString: function isNumberString(value) {
        if (_lodash2.default.isString(value) && value.length > 0 && !isNaN(value)) {
            return true;
        }
        return false;
    },
    isDateString: function isDateString(date) {

        if (!date) {
            return false;
        }

        if (!isNaN(Number(date))) {
            return false;
        }

        if (!_lodash2.default.isNumber(date) && new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) && ((0, _moment2.default)(date).format().indexOf(date) !== -1 || date.match(/^\d+-\d+-\d+T\d+:\d+:\d+/))) {
            return true;
        }

        return false;
    },
    isFormController: function isFormController(item, name) {
        return (_lodash2.default.endsWith(name.toLowerCase(), "form") || name.toLowerCase() == "form") && _lodash2.default.has(item, "$submitted");
    },
    getFormController: function getFormController($scope) {
        var _this = this;

        var form;
        _lodash2.default.each($scope, function (value, name) {
            if (_this.isFormController(value, name)) {
                form = $scope[name];
            }
        }, this);

        if (form) {
            return form;
        }

        if ($scope.$parent) {
            return this.getFormController($scope.$parent);
        }

        return null;
    },
    setFormInChildScope: function setFormInChildScope($scope, $parent) {
        var _this2 = this;

        if ($scope && $parent) {
            var setForm = false;
            _lodash2.default.each($parent, function (value, name) {
                if (_this2.isFormController(value, name)) {
                    $scope[name] = value;

                    if (name !== "formCtrl") {
                        name = "formCtrl";
                        $parent[name] = value;
                    }
                    $scope[name] = value;

                    setForm = true;
                }
            }, this);

            if (setForm) {
                return true;
            }

            if ($parent.$parent) {
                this.setFormInChildScope($scope, $parent.$parent);
            }
        }
        return false;
    },
    convertToNumber: function convertToNumber(value) {
        if (ParserHelper.isNumberString(value)) {
            if (value.indexOf('.') !== -1) {
                return parseFloat(value);
            } else {
                return parseInt(value, 10);
            }
        }

        return value;
    },
    isDateTimeString: function isDateTimeString(value) {
        if (!value) {
            return false;
        }

        if (!isNaN(Number(value))) {
            return false;
        }

        return value.match(/^\d+-\d+-\d+T\d+:\d+:\d+/) ? true : false;
    },
    getValueWithNestedKey: function getValueWithNestedKey(obj, key) {
        if (key.indexOf(".")) {
            // Need to deal with arrays
            var keys = key.split(".");
            var lastHash = keys.pop();
            while (key = keys.shift()) {

                if (_lodash2.default.isString(key) && key.indexOf("[") === 0) {
                    key = key.replace("[", "").replace("]", "");
                    key = parseInt(key, 10);
                }

                if (!_lodash2.default.has(obj, key)) {
                    return null;
                }

                obj = obj[key];
            }
            key = lastHash;
        }
        if (_lodash2.default.has(obj, key)) {
            return obj[key];
        }

        return null;
    },

    /*
     Array keys need to have brackets
     FreightVendors.[0].Name
     */
    setObjectWithNestedKey: function setObjectWithNestedKey(obj, key, value) {

        if (key.indexOf(".")) {
            // Need to deal with arrays
            var keys = key.split(".");
            var lastHash = keys.pop();
            for (var i = 0; i < keys.length; i++) {
                var keyPointer = keys[i];

                if (_lodash2.default.isString(keyPointer) && keyPointer.indexOf("[") === 0) {
                    keyPointer = keyPointer.replace("[", "").replace("]", "");
                    keyPointer = parseInt(keyPointer, 10);
                }

                if (!_lodash2.default.has(obj, keyPointer) || !_lodash2.default.isObject(obj[keyPointer])) {

                    var newObj = {};
                    var nextKey = i + 1;

                    if (keys.length > nextKey && _lodash2.default.isString(keys[nextKey]) && keys[nextKey].indexOf("[") === 0) {
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
    convertToDateStrings: function convertToDateStrings(obj) {

        if (!ParserHelper.isContainer(obj)) {
            return obj;
        }

        _lodash2.default.each(obj, function (value, key) {

            if (ParserHelper.isContainer(value)) {
                ParserHelper.convertToDateStrings(value);
            }

            if (_lodash2.default.isDate(value)) {
                obj[key] = (0, _moment2.default)(value).format('YYYY-MM-DD');
            }
        }, this);
    },
    convertToDateString: function convertToDateString(datevalue) {
        var date = datevalue;
        //if(this.isDateString(datevalue)) {
        //    date = new Date(datevalue);
        //
        //}

        if (date instanceof _moment2.default) {
            return date.format("YYYY-MM-DD");
        }

        return (0, _moment2.default)(date).format("YYYY-MM-DD");
    },
    convertToDB: function convertToDB(structure) {

        if (!ParserHelper.isContainer(structure)) {
            return structure;
        }
        _lodash2.default.each(structure, function (value, key) {
            switch (true) {
                case ParserHelper.isContainer(value):
                    ParserHelper.convertToDB(value);
                    break;
                case ParserHelper.isDate(value):
                    structure[key] = (0, _moment2.default)(value).format();
                    break;
                case !_lodash2.default.isObject(value):
                    break;
                default:
                    console.log("Couldn't convert " + Object.prototype.toString.call(value), value);
                    throw new Error("Couldn't convert " + Object.prototype.toString.call(value) + " in your api send!");

            }
        }, this);

        return structure;
    },
    convertToApp: function convertToApp(structure) {
        if (!ParserHelper.isContainer(structure)) {
            return structure;
        }
        _lodash2.default.each(structure, function (value, key) {

            if (ParserHelper.isContainer(value)) {
                ParserHelper.convertToApp(value);
            } else {
                switch (true) {
                    /*
                     If we have an empty string, converting to null so we only 
                     ever have to check for nulls
                     */
                    case _lodash2.default.isString(value) && value.length == 0:
                        structure[key] = null;
                        break;
                    case ParserHelper.isNumberString(value):
                        structure[key] = ParserHelper.convertToNumber(value);
                        break;
                    // Try as a date
                    case ParserHelper.isDateString(value):
                        structure[key] = new Date(value);
                        break;

                }
            }
        }, this);
        return structure;
    }
};

exports.default = ParserHelper;