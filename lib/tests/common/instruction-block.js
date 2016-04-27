'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require("chai-as-promised");

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _describeBlock = require("./describe-block");

var _describeBlock2 = _interopRequireDefault(_describeBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

var InstructionBlock = function () {
	function InstructionBlock(describe, event) {
		_classCallCheck(this, InstructionBlock);

		this.describe = describe;
		this.event = event;
	}

	_createClass(InstructionBlock, [{
		key: "output",
		value: function output(Page) {
			/*
    instruction units
    */

			var describe = new _describeBlock2.default(this.describe);
			var actionFn = function actionFn(description, event) {
				describe.it("ACTION: " + description, event);
			};

			this.event(actionFn);

			return describe;
		}
	}]);

	return InstructionBlock;
}();

exports.default = InstructionBlock;