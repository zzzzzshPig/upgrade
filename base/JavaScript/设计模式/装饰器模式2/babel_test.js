'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../../utils'),
    isFunction = _require.isFunction;

var Vue = (_dec = Component({
	mixins: [],
	components: {},
	filters: {}
}), _dec(_class = function () {
	function Vue() {
		_classCallCheck(this, Vue);
	}

	_createClass(Vue, [{
		key: 'data',
		value: function data() {
			return {
				title: '装饰器模式'
			};
		}
	}, {
		key: 'changeTitle',
		value: function changeTitle(title) {
			this.title = title;
		}
	}]);

	return Vue;
}()) || _class);


function Component(options) {
	return function (target) {
		var prototype = target.prototype;

		var data = prototype.data();
		for (var key in data) {
			prototype[key] = data[key];
		}
		delete prototype.data;

		prototype.components = options.components;
		prototype.mixins = options.mixins;
		prototype.filters = options.filters;
	};
}

var app = new Vue();
app.changeTitle('装饰器模式真香');
console.log(app.title, app.components);
