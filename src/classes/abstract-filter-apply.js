'use strict';

import _ from "lodash";

class AbstractFilterList {
	constructor(applyFilters) {
		this.applyFilters = applyFilters;
		this.filtering = false;
		this.filter = {};

		this.showSearch();
	}
	isSearchable(){

		if(!_.isObject(this.filter)) {
			return false;
		}
    var hasFilters = false;

    var keys = _.keys(this.filter);
    _.each(keys, function(key) {
      var item = this.filter[key];

      switch(true){
          case _.isString(item):
            if (item.length > 0) {
              hasFilters = true;
              return true;
            }
            break;
          case _.isNumber(item):
            if(item > -1) {
              hasFilters = true;
              return true;
            }
            break;
          case item !== null && !_.isUndefined(item):
            hasFilters = true;
            return true;
            break;
      }



    }, this);

		return hasFilters;

	}
	clearObject(obj){
    /*
      We want to nullify rather than delete because otherwise if you have a value and delete it,
      it doesn't seem to update the filter for some reason.
     */
		_.each(obj, function(value,key){
			obj[key] = null;
		});
	}
	clearFilter() {
		this.clearObject(this.applyFilters);
		this.clearObject(this.filter);
		this.filtering = false;
	}
	toggleSearch(){
		this.enableResults = !this.enableResults;
	}
	showSearch(){
		this.enableResults = true;
	}
	hideSearch(){
		this.enableResults = false;
	}
	search(){
		if(this.isSearchable()) {

			this.clearObject(this.applyFilters);

			_.each(this.filter, (value, key)=> {
				if(_.isString(value) && value.length === 0){
					value = null;
				}

				this.applyFilters[key] = value;

			}, this);

			this.filtering = true;
		}
		this.showSearch();
	}


}

export default AbstractFilterList;
