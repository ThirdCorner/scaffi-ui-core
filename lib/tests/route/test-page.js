'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _abstractTest = require('../abstracts/abstract-test');

var _abstractTest2 = _interopRequireDefault(_abstractTest);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instructionBlock = require('../common/instruction-block');

var _instructionBlock2 = _interopRequireDefault(_instructionBlock);

var _describeBlock = require('../common/describe-block');

var _describeBlock2 = _interopRequireDefault(_describeBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TestPage = function (_AbstractTest) {
	(0, _inherits3.default)(TestPage, _AbstractTest);

	function TestPage(pageUrl, opts) {
		(0, _classCallCheck3.default)(this, TestPage);


		// Get rid of any prefexed slashes

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TestPage).call(this, opts));

		if (pageUrl.indexOf("/") === 0) {
			pageUrl = pageUrl.substr(1);
		}
		if (pageUrl.indexOf(Page.getBaseUrl()) !== 0) {
			pageUrl = Page.getBaseUrl() + pageUrl;
		}

		_this.pageUrl = pageUrl;
		_this.newSuite("Test Page");

		_this.instructions = [];

		/*
  	Instruction to check that page navigated correctly
   */
		var that = _this;

		var checkPageInstruction = new _instructionBlock2.default("Load Page: " + pageUrl, function (action) {
			action("Go to page", function () {
				Page.actions.go(that.pageUrl);
			});
		});

		_this.instructions.push(checkPageInstruction);
		return _this;
	}

	(0, _createClass3.default)(TestPage, [{
		key: 'testCustom',
		value: function testCustom(description, fn) {
			if (!description || !fn) {
				throw new Error('You must provide a description and test fn if you want to call testCustom.');
			}
			this.instructions.push(new _instructionBlock2.default(description, fn));

			return this;
		}
	}, {
		key: 'output',
		value: function output() {
			var _this2 = this;

			var that = this;
			_lodash2.default.each(this.instructions, function (instruction) {

				var describe = instruction.output();
				//describe.beforeAll(()=>{
				//	browser.get(that.pageUrl);
				//});
				_this2.addTest(describe);
			}, this);

			this.outputTests();
		}
	}]);
	return TestPage;
}(_abstractTest2.default);

exports.default = TestPage;