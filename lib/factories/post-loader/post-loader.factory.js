'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class; // jshint unused: false


var _ngDecorators = require('../../ng-decorators');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//end-non-standard

/*
    This class is so that scaffi-ui-core components can run stuff after everything else in a project is loaded.
 */
//start-non-standard
var PostLoader = (_dec = (0, _ngDecorators.Factory)({
	factoryName: 'postLoader'
}), _dec(_class = function () {
	function PostLoader() {
		(0, _classCallCheck3.default)(this, PostLoader);

		this.events = [];
	}

	(0, _createClass3.default)(PostLoader, [{
		key: 'add',
		value: function add(event) {
			this.events.push(event);
		}
	}, {
		key: 'call',
		value: function call() {
			_lodash2.default.each(this.events, function (event) {
				event();
			});
		}
	}], [{
		key: 'factory',
		value: function factory() {
			PostLoader.instance = new PostLoader();
			return PostLoader.instance;
		}
	}]);
	return PostLoader;
}()) || _class);
exports.default = PostLoader;