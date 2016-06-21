'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require("chai-as-promised");

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _describeBlock = require("./describe-block");

var _describeBlock2 = _interopRequireDefault(_describeBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);
var expect = _chai2.default.expect;

var InstructionBlock = function () {
	function InstructionBlock(describe, event) {
		(0, _classCallCheck3.default)(this, InstructionBlock);

		this.describe = describe;
		this.event = event;
	}

	(0, _createClass3.default)(InstructionBlock, [{
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