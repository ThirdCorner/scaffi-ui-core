'use strict';

import _ from 'lodash';
import ParserHelper from '../helpers/parser-helper';

class AbstractPage {
	constructor($scope) {
		if($scope.$parent) {
			this._loadParentForm($scope)
		}
	}
	_loadParentForm($scope){
		ParserHelper.setFormInChildScope($scope, $scope.$parent);
	}
}

export default AbstractPage;