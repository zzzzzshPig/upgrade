class Vue {
	constructor (options) {
		this.data = options.data()
		this.methods = options.methods

		for (let key in this.methods) {
			this.methods[key] = this.methods[key].bind(this)
		}
		// ...
	}
}

/*
* 装饰器 Component
*/
class Component {
	constructor (Vue, options) {
		Vue.components = options.components
		Vue.beforeRouteEnter = options.beforeRouteEnter
		Vue.filters = options.filters
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

new Component(app, {
	components: {
		modal: 'modal'
	}
})

app.methods.changeTitle('装饰器模式真香')
console.log(app.components.modal)
