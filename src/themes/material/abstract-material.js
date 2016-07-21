'use strict';

import _ from 'lodash';
import AbstractTheme from '../../classes/abstract-theme';

/*
 We want to be able to make custom bootstrap modules that we can then include here
 */

class AbstractMaterial extends AbstractTheme {
	constructor(args){
		super(args);

		this.addRequires([]);
	}
}

export default AbstractMaterial