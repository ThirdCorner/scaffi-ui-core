'use strict';

import _ from 'lodash';
import ParserHelper from '../helpers/parser-helper';

class AbstractPage {
	constructor($scope) {
		
	}
	/*
		We shouldn't need to setForm in scope, because page
		should be top level scope with form already.
		
		It's the stub pages we have issue with
	 */
	// _loadParentForm($scope){
	// 	ParserHelper.setFormInChildScope($scope, $scope.$parent);
	// }
}

export default AbstractPage;