'use strict';

import _ from 'lodash';
import ParserHelper from '../helpers/parser-helper';

class AbstractStubPage {
	constructor($scope) {
		if($scope.$parent) {
			this._loadParentForm($scope)
		}
	}
	_loadParentForm($scope){
		ParserHelper.setFormInChildScope($scope);
	}
}

export default AbstractStubPage;