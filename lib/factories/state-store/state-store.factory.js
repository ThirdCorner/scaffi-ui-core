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

var _stateModel = require('../../classes/state-model');

var _stateModel2 = _interopRequireDefault(_stateModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//end-non-standard


//start-non-standard
var StateStore = (_dec = (0, _ngDecorators.Factory)({
	factoryName: 'stateStore'
}), _dec(_class = function () {
	function StateStore($rootScope, socketIO) {
		(0, _classCallCheck3.default)(this, StateStore);


		this.$rootScope = $rootScope;
		this.socketIO = socketIO;

		this.requestStore = [];
		this.queue = [];

		this.transitionState = null;
		this.currentState = null;

		var that = this;
		$rootScope.$on('$stateChangeStart', function (event, toState) {
			that.transitionState = toState.name;
			that.currentState = null;
		});
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			that.currentState = toState.name;
			//that._processQueue();
			console.log(that.requestStore);
		});
	}

	(0, _createClass3.default)(StateStore, [{
		key: 'registerRequest',
		value: function registerRequest(service, url, data) {

			var request = { url: url, service: service };

			var returnData;
			returnData = new _stateModel2.default(url, service, data, this.socketIO);
			request.data = returnData;
			this.addToStore(request);

			return returnData.getRest();
		}
	}, {
		key: 'addToStore',
		value: function addToStore(request) {
			this.requestStore = _lodash2.default.filter(this.requestStore, function (item) {
				return item.url !== request.url;
			});
			this.requestStore.push(request);
		}
	}], [{
		key: 'factory',
		value: function factory($rootScope, socketIO) {
			StateStore.instance = new StateStore($rootScope, socketIO);
			return StateStore.instance;
		}
	}]);
	return StateStore;
}()) || _class);
exports.default = StateStore;