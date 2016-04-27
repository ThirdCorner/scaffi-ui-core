'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _abstractTest = require('../abstracts/abstract-test');

var _abstractTest2 = _interopRequireDefault(_abstractTest);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instructionBlock = require('../common/instruction-block');

var _instructionBlock2 = _interopRequireDefault(_instructionBlock);

var _describeBlock = require('../common/describe-block');

var _describeBlock2 = _interopRequireDefault(_describeBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TestPage = function (_AbstractTest) {
	_inherits(TestPage, _AbstractTest);

	function TestPage(pageUrl, opts) {
		_classCallCheck(this, TestPage);

		// Get rid of any prefexed slashes

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TestPage).call(this, opts));

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

	_createClass(TestPage, [{
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