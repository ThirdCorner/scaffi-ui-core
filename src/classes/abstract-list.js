'use strict';

import _ from 'lodash';

class AbstractList {
    constructor(NgTableParams, $scope) {
        var that = this;
        this.fetchingData = false;
        this.error = false;
        this.initialLoaded = false;
        this.$scope = $scope;

        if(!_.isObject($scope.filters)) {
            throw new Error("Table filters must have a param filters set with an object.");
        }


        this.tableParams = new NgTableParams({}, {
            filterDelay: 10,
            getData: function (params) {
                if(!that.fetchingData) {
                    this.error = false;
                    that.fetchingData = true;
                    return that.getData(params).then(function (data) {
                        that.fetchingData = false;
                        that.error = false;
                        that.initialLoaded = true;
                        if (!data) {
                            that.error = true;
                            return [];
                        } else {
                            params.total(data.inlineCount); // recal. page nav controls
                            that.rowCount = data.inlineCount;
                            that.afterLoad(data.results);
                            return data.results;
                        }
                    });
                }
            }
        });

        $scope.$watch('filters', (newFilter)=> {
            this.tableParams.filter(newFilter);
            this.tableParams.reload();
        }, true);

    }
    getData(params) {
        throw new Error("You must provide a getData function that returns a promise");
    }
    afterLoad(serverData){
      //Extend
    }
}

export default AbstractList;
