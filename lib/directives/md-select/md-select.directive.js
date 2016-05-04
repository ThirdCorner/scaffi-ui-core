'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../../index.js');

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//end-non-standard
// jshint unused: false;
//start-non-standard
var MdSelect = (_dec = (0, _ngDecorators.Directive)({
	selector: 'md-select'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function MdSelect($rootScope, $state) {
		_classCallCheck(this, MdSelect);

		this.restrict = 'E';
		this.scope = false;
	}

	_createClass(MdSelect, [{
		key: 'compile',
		value: function compile(element, attrs) {

			var messageContainer = null;
			if (attrs.name) {
				messageContainer = _index.ValidationGeneratorHelper.generateMessageContainer(element, attrs.name, attrs);
			}

			var validationAttributes = {
				required: 'This field cannot be left empty.'
			};

			/*
    Because of ngMessages happening in the compile, if you try to add the messages in the pre link,
    ngMessage directive WILL NOT pick them up.
    */
			_index.ValidationGeneratorHelper.generateMessageDiv(element, messageContainer, validationAttributes, attrs);

			return {
				pre: function pre(scope, element, attrs, ngModel) {}
			};
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			MdSelect.instance = new MdSelect($rootScope, $state);
			return MdSelect.instance;
		}
	}]);

	return MdSelect;
}()) || _class);
exports.default = MdSelect;