'use strict';

import AbstractTest from '../abstracts/abstract-test';

import _ from 'lodash';

import InstructionBlock from '../common/instruction-block';

import DescribeBlock from '../common/describe-block';


class TestPage extends AbstractTest {
	constructor(pageUrl, opts){
		super(opts);

		// Get rid of any prefexed slashes
		if(pageUrl.indexOf("/") === 0) {
			pageUrl = pageUrl.substr(1);
		}
		if(pageUrl.indexOf(Page.getBaseUrl()) !== 0) {
			pageUrl = Page.getBaseUrl() + pageUrl;
		}

		this.pageUrl = pageUrl;
		this.newSuite("Test Page");

		this.instructions = [];

		/*
			Instruction to check that page navigated correctly
		 */
		var that = this;

		var checkPageInstruction = new InstructionBlock("Load Page: " + pageUrl, (action)=>{
			action("Go to page", ()=>{
				Page.actions.go(that.pageUrl);
			});
		});

		this.instructions.push(checkPageInstruction);
	}
	testCustom(description, fn){
		if(!description || !fn) {
			throw new Error('You must provide a description and test fn if you want to call testCustom.');
		}
		this.instructions.push(new InstructionBlock(description, fn));

		return this;
	}
	output(){
		var that = this;
		_.each(this.instructions, (instruction)=>{

			var describe = instruction.output();
			//describe.beforeAll(()=>{
			//	browser.get(that.pageUrl);
			//});
			this.addTest(describe);
		}, this);

		this.outputTests();
	}

}

export default TestPage;