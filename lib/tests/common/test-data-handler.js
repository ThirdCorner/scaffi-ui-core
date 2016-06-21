'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _parserHelper = require('../../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TestDataHandler = function () {
    function TestDataHandler() {
        (0, _classCallCheck3.default)(this, TestDataHandler);

        this.ID_PROP = _index2.default.config.getIdPropertyName();
    }

    (0, _createClass3.default)(TestDataHandler, [{
        key: 'randomString',
        value: function randomString() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 7; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }return text;
        }
    }, {
        key: 'getDataType',
        value: function getDataType(value) {
            switch (true) {
                case _lodash2.default.isNull(value):
                case _lodash2.default.isUndefined(value):
                    return null;
                case _parserHelper2.default.isObject(value):
                    return "object";
                    break;
                case _parserHelper2.default.isContainer(value):
                    return "array";
                    break;
                case _parserHelper2.default.isDateString(value):
                    return "date";
                    break;
                default:
                    return typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value);
            }
        }
    }, {
        key: 'getDataTypeMap',
        value: function getDataTypeMap(data) {
            var returnData = {};
            _lodash2.default.each(data, function (value, key) {

                if (_parserHelper2.default.isContainer(value)) {
                    if (_lodash2.default.isArray(value)) {
                        returnData[key] = [];
                        _lodash2.default.each(value, function (obj) {
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
    }, {
        key: 'matchFixtureDataStructure',
        value: function matchFixtureDataStructure(fixtureValue, changeValue) {
            changeValue = _parserHelper2.default.convertToNumber(changeValue);
            if (_lodash2.default.isNumber(changeValue) && _lodash2.default.isNumber(fixtureValue)) {

                if (fixtureValue.toString().indexOf('.') !== -1) {
                    var percision = fixtureValue.toString().length - (fixtureValue.toString().indexOf('.') + 1);
                    changeValue = parseFloat(changeValue.toFixed(percision));
                }
            }

            return changeValue;
        }
    }, {
        key: 'copy',
        value: function copy(obj) {
            return JSON.parse((0, _stringify2.default)(obj));
        }
    }, {
        key: 'excludeProperties',
        value: function excludeProperties(arrOfProperties, structure) {
            structure = this.copy(structure);

            var that = this;
            function deepRemoveSearch(structure, key) {
                if (key.indexOf(".") === -1) {
                    if (_lodash2.default.has(structure, key) || key == that.ID_PROP) {
                        delete structure[key];
                    }
                    return;
                }

                var keys = key.split(".");
                var baseKey = keys.shift();
                key = keys.join(".");
                if (!_lodash2.default.has(structure, baseKey)) {
                    return;
                }

                if (_lodash2.default.isArray(structure, baseKey)) {
                    _lodash2.default.each(structure[baseKey], function (arrItem) {
                        deepRemoveSearch(arrItem, key);
                    }, this);
                } else {
                    deepRemoveSearch(structure[baseKey], key);
                }
            }
            _lodash2.default.each(arrOfProperties, function (propName) {
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

    }, {
        key: 'matchFixtureProperties',
        value: function matchFixtureProperties(fixture, testObj, shouldSquashExtraArrayEntries) {
            shouldSquashExtraArrayEntries = _lodash2.default.isUndefined(shouldSquashExtraArrayEntries) ? false : shouldSquashExtraArrayEntries;

            var retValues;
            if (_lodash2.default.isArray(testObj)) {
                retValues = [];
            } else {
                retValues = {};
            }
            _lodash2.default.each(testObj, function (value, name) {
                if (!_lodash2.default.has(fixture, name)) {
                    if (!_lodash2.default.isArray(testObj) || _lodash2.default.isArray(testObj) && shouldSquashExtraArrayEntries) {
                        return;
                    }
                }

                retValues[name] = value;

                /*
                    This was relying on passing by value, but then things weren't getting trimmed so
                    we're setting it in a new object and returning it.
                 */
                if (_parserHelper2.default.isContainer(value)) {
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

    }, {
        key: 'fixValuesForComparison',
        value: function fixValuesForComparison(fixture, fetchedData) {
            _lodash2.default.each(fixture, function (value, key) {
                if (_parserHelper2.default.isContainer(value) && _lodash2.default.has(fetchedData, key)) {
                    this.fixValuesForComparison(fixture[key], fetchedData[key]);
                    return;
                } else {
                    if (!_lodash2.default.has(fetchedData, key)) {
                        return;
                    }
                    fetchedData[key] = this.fixValueStructure(value, fetchedData[key]);
                }
            }, this);
        }
    }, {
        key: 'fixValueStructure',
        value: function fixValueStructure(referenceValue, changeValue) {
            switch (true) {
                case _parserHelper2.default.isDateString(referenceValue) && !_parserHelper2.default.isDateTimeString(referenceValue) && _parserHelper2.default.isDateTimeString(changeValue):
                    changeValue = _parserHelper2.default.convertToDateString(changeValue);
                    break;
            }

            return changeValue;
        }
    }, {
        key: 'changeValueBasedOnType',
        value: function changeValueBasedOnType(value) {
            switch (this.getDataType(value)) {
                case "date":
                    return _parserHelper2.default.convertToDateString((0, _moment2.default)(value).subtract(2, "days").subtract(1, "month"));
                    break;
                case "boolean":
                    return !value;
                    break;
                case "number":
                    return value + Math.floor(Math.random() * 10 + 1);
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

    }, {
        key: 'changeDataBasedOnType',
        value: function changeDataBasedOnType(dataObj, ignoreArr) {

            if (!ignoreArr || !_lodash2.default.isArray(ignoreArr)) {
                ignoreArr = [];
            }
            if (ignoreArr.indexOf(this.ID_PROP) === -1) {
                ignoreArr.push(this.ID_PROP);
            }

            _lodash2.default.each(dataObj, function (value, key) {
                if (_parserHelper2.default.isContainer(value)) {
                    var newIgnores = [];
                    _lodash2.default.each(ignoreArr, function (ignore) {
                        // This looks for nested ignores
                        if (ignore.indexOf(".") !== -1 && ignore.indexOf(key) === 0) {
                            newIgnores.push(ignore.substr(ignore.indexOf(".") + 1));
                        }
                    }, this);

                    this.changeDataBasedOnType(dataObj[key], newIgnores);
                } else if (ignoreArr.indexOf(key) === -1) {
                    dataObj[key] = this.changeValueBasedOnType(dataObj[key]);
                }
            }, this);

            return dataObj;
        }
    }]);
    return TestDataHandler;
}();

exports.default = new TestDataHandler();