@Component({
	mixins: [],
	components: {},
	filters: {}
})
class Vue {
	constructor() {}

	data () {
		return {
			title: '装饰器模式'
		}
	}

	changeTitle (title) {
		this.title = title
	}
}

function Component (options) {
	return function (target) {
		const prototype = target.prototype

		const data = prototype.data()
		for (let key in data) {
			prototype[key] = data[key]
		}
		delete prototype.data

		prototype.components = options.components
		prototype.mixins = options.mixins
		prototype.filters = options.filters
	}
}

const app = new Vue()
app.changeTitle('装饰器模式真香')
console.log(app.title, app.components)
