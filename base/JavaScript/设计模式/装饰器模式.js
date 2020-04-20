class Vue {
	constructor (options) {
		this.data = options.data
		this.methods = options.methods
		// ...
	}
}

/*
* 装饰器 Component
*/
class Component {
	constructor (Vue, options) {
		this.components = options.components
		this.beforeRouteEnter = options.beforeRouteEnter
		this.filters = options.filters

		const data = Vue.data()
		for (let key in data) {
			this[key] = data[key]
		}

		for (let key in Vue.methods) {
			this[key] = Vue.methods[key]
		}
		// ...
	}
}

const app = new Vue({
	data () {
		return {
			title: '装饰器模式'
		}
	},

	methods: {
		changeTitle (title) {
			this.title = title
		}
	}
})

const app1 = new Component(app, {
	components: {
		modal: 'modal'
	}
})

app1.changeTitle('装饰器模式真香')
console.log(app1, app)
