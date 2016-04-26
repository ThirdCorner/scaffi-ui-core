
import _ from 'lodash';

class DescribeBlock{
    constructor(describe) {
        this.text = describe || null;
        this.itBlock = [];
        this.beforeBlock = [];
        this.describeBlock = [];
        this.afterBlock = [];
    }
	beforeAll(fn) {
		this.beforeBlock.unshift({fn: fn});
	}
    before(fn) {
        this.beforeBlock.push({fn: fn});
    }
    it(text, fn) {
        if(!text || !fn) {
            throw new Error("You need to provide text and a callback when declaring a DescribeBlock.it nest.");
        }
        this.itBlock.push({text: text, fn: fn});
    }
    describe(describeClass) {
        this.describeBlock.push({fn: describeClass});
    }
    after(callFn) {
        this.afterBlock.push({fn: callFn});
    }
    getText(){
        return this.text;
    }
    getDescribes(){
        return this.describeBlock;
    }

    output(text) {
        var that = this;
        if(this.text) {
            text = this.text;
        }

        if(text) {
            describe(text, function () {
                that._outputChildren();
            });
        } else {
            that._outputChildren();
        }
    }
    _outputChildren(){
        if(this.beforeBlock) {
            _.each(this.beforeBlock, function(beforeObj){
                before(beforeObj.fn);
            }, this);
        }
        if(this.itBlock) {
            _.each(this.itBlock, function(itObj){
                it(itObj.text, itObj.fn);
            }, this);
        }
        if(this.describeBlock) {
            _.each(this.describeBlock, function(describeObj){
                if(!_.isFunction(describeObj.fn.output)) {
                    throw "You must provide a DescribeBlock class for entry: " + describeObj.text;
                }
                describeObj.fn.output(describeObj.fn.text);

            }, this);
        }
        if(this.afterBlock) {
            _.each(this.afterBlock, function(afterObj){
               after(afterObj.fn);
            });
        }
    }
}

export default DescribeBlock;