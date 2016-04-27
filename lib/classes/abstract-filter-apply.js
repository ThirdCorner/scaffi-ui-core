'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractFilterList = function () {
	function AbstractFilterList(applyFilters) {
		_classCallCheck(this, AbstractFilterList);

		this.applyFilters = applyFilters;
		this.filtering = false;
		this.filter = {};

		this.showSearch();
	}

	_createClass(AbstractFilterList, [{
		key: "isSearchable",
		value: function isSearchable() {

			if (!_lodash2.default.isObject(this.filter)) {
				return false;
			}
			var hasFilters = false;

			var keys = _lodash2.default.keys(this.filter);
			_lodash2.default.each(keys, function (key) {
				var item = this.filter[key];

				switch (true) {
					case _lodash2.default.isString(item):
						if (item.length > 0) {
							hasFilters = true;
							return true;
						}
						break;
					case _lodash2.default.isNumber(item):
						if (item > -1) {
							hasFilters = true;
							return true;
						}
						break;
					case item !== null && !_lodash2.default.isUndefined(item):
						hasFilters = true;
						return true;
						break;
				}
			}, this);

			return hasFilters;
		}
	}, {
		key: "clearObject",
		value: function clearObject(obj) {
			/*
     We want to nullify rather than delete because otherwise if you have a value and delete it,
     it doesn't seem to update the filter for some reason.
    */
			_lodash2.default.each(obj, function (value, key) {
				obj[key] = null;
			});
		}
	}, {
		key: "clearFilter",
		value: function clearFilter() {
			this.clearObject(this.applyFilters);
			this.clearObject(this.filter);
			this.filtering = false;
		}
	}, {
		key: "toggleSearch",
		value: function toggleSearch() {
			this.enableResults = !this.enableResults;
		}
	}, {
		key: "showSearch",
		value: function showSearch() {
			this.enableResults = true;
		}
	}, {
		key: "hideSearch",
		value: function hideSearch() {
			this.enableResults = false;
		}
	}, {
		key: "search",
		value: function search() {
			var _this = this;

			if (this.isSearchable()) {

				this.clearObject(this.applyFilters);

				_lodash2.default.each(this.filter, function (value, key) {
					if (_lodash2.default.isString(value) && value.length === 0) {
						value = null;
					}

					_this.applyFilters[key] = value;
				}, this);

				this.filtering = true;
			}
			this.showSearch();
		}
	}]);

	return AbstractFilterList;
}();

exports.default = AbstractFilterList;