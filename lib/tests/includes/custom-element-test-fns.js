'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CustomElementSetFieldEvents = exports.CustomElementParsers = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import {ComponentFormElement, ComponentFormElementSet} from 'app/includes';
/*
    protractorElem is the base element where the component starts
 */

var CustomElementParsers = {
    "date-picker": function datePicker(protractorElem) {
        return protractorElem.element(by.className('date-input'));
    },
    "weight-to-pounds": function weightToPounds(protractorElem) {
        return protractorElem.element(by.className('manual-input'));
    }

};
//
// _.each(ComponentFormElement, (value, name)=>{
//   CustomElementParsers[name] = value;
// });

/*
    protractorElem here is the actual form element
 */
var CustomElementSetFieldEvents = {
    "date-picker": function datePicker(protractorElem, value) {
        var datestring = (0, _moment2.default)(value).format('YYYY-MM-DD');
        protractorElem.sendKeys(datestring);
    }
};
//
// _.each(ComponentFormElementSet, (value, name)=>{
//   CustomElementSetFieldEvents[name] = value;
// });

exports.CustomElementParsers = CustomElementParsers;
exports.CustomElementSetFieldEvents = CustomElementSetFieldEvents;