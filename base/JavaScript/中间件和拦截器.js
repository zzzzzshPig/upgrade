// axios拦截器

class Interceptor {
	constructor () {
		this.queue = []
	}

	use (res, rej) {
		// The res and rej function is to support the promise
		this.queue.push([res, rej])
		return this
	}

	// 只支持一个参数
	async run (res) {
		let q = Promise.resolve(res)
		for (let i = 0; i < this.queue.length; i++) {
			q = q.then(this.queue[i][0]).catch(this.queue[i][1])
		}
		return q
	}
}

class axios {
	constructor () {
		this.requestInterceptor = new Interceptor()

		this.responseInterceptor = new Interceptor()
	}

	// test
	async run () {
		let res = await this.requestInterceptor.run({test: 'test'})

		res.result = {
			code: 200,
			message: 'success'
		}

		await this.responseInterceptor.run(res)
	}
}

const $axios = new axios()

$axios.requestInterceptor.use(config => {
	return {
		...config,
		extraParams1: 'extraParams1',
	};
}).use(config => {
	return {
		...config,
		extraParams2: 'extraParams2',
	}
}).use(config => {
	return new Promise((resolve) => {
		setTimeout(resolve.bind(null, config), 2000)
	})
})

$axios.responseInterceptor.use(
	resp => {
		const {
			extraParams1,
			extraParams2,
			result: { message },
		} = resp;
		return `${extraParams1} ${extraParams2} ${message}`;
	},
	error => {
		console.log('error', error)
	},
).use(res => console.log(res), err => console.log(err))

$axios.run()
