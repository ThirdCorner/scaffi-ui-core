'use strict';

import moment from 'moment';
//import {ComponentFormElement, ComponentFormElementSet} from 'app/includes';
/*
    protractorElem is the base element where the component starts
 */

var CustomElementParsers = {
    "date-picker": (protractorElem) => {
        return protractorElem.element(by.className('date-input'));
    },
    "weight-to-pounds": (protractorElem)=>{
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
    "date-picker": (protractorElem, value) =>{
        var datestring = moment(value).format('YYYY-MM-DD');
        protractorElem.sendKeys(datestring);
    }
};
//
// _.each(ComponentFormElementSet, (value, name)=>{
//   CustomElementSetFieldEvents[name] = value;
// });

export {CustomElementParsers,CustomElementSetFieldEvents};
