'use strict';

import chai from "chai";
import promised from "chai-as-promised";
chai.use(promised);
var expect = chai.expect;

import DescribeBlock from './describe-block';

class InstructionBlock{

	constructor(describe, event){
		this.describe = describe;
		this.event = event;
	}
	output(Page){
		/*
		 instruction units
		 */

		var describe = new DescribeBlock(this.describe);
		var actionFn = function(description, event){
			describe.it("ACTION: " + description, event);
		};

		this.event(actionFn);

		return describe;
	}

}

export default InstructionBlock;