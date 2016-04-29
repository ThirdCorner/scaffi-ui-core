'use strict';

import _ from 'lodash';

class AbstractStubPage {
	constructor($scope) {
		if($scope.$parent) {
			this._loadParentForm($scope)
		}
	}
	_loadParentForm($scope){
		_.each($scope.$parent, (value, name)=>{
			if(_.endsWith(name, "Form")) {
				$scope[name] = $scope.$parent[name];
			}
		}, this);
	}
}

export default AbstractStubPage;