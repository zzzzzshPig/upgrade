const {isFunction} = require('./utils')

class promise {
	constructor (fn) {
		if (!isFunction(fn)) throw TypeError('Promise resolver undefined is not a function')

		this.status = 'pending'
		this.value = undefined
		this.thenRes = []
		this.thenRej = []

		const resolve = (value) => {
			if (this.status !== 'pending') return

			process.nextTick(() => {
				this.status = 'resolve'
				this.value = value

				for (let res of this.thenRes) {
					res(this.value)
				}

				this.thenRes = null
			})
		}

		const reject = (error) => {
			if (this.status !== 'pending') return

			process.nextTick(() => {
				this.status = 'reject'
				this.value = error

				for (let rej of this.thenRej) {
					rej(this.value)
				}

				if (this.thenRej.length === 0) throw error
				this.thenRej = null
			})
		}

		try {
			fn(resolve, reject)
		} catch (e) {
			reject(e)
		}
	}

	then (res, rej) {
		if (!isFunction(res)) {
			res = () => {}
		}

		if (!isFunction(rej)) {
			rej = (err) => {throw err}
		}

		if (this.status === 'pending') {
			return new promise((resolve, reject) => {
				this.thenRes.push((value) => {
					try {
						const v = res(value)

						// promise,promise.resolve,promise.reject
						if (v instanceof promise) {
							v.then((res1) => {
								resolve(res1)
							}, rej1 => {
								reject(rej1)
							})
						} else {
							resolve(v)
						}
					} catch (e) {
						reject(e)
					}
				})

				this.thenRej.push((value) => {
					try {
						const v = rej(value)

						// promise,promise.resolve,promise.reject
						if (v instanceof promise) {
							v.then((res1) => {
								resolve(res1)
							}, rej1 => {
								reject(rej1)
							})
						} else {
							resolve(v)
						}
					} catch (e) {
						reject(e)
					}
				})
			})
		}
		else if (this.status === 'resolve') {
			return new promise((resolve, reject) => {
				process.nextTick(() => {
					try {
						const v = res(this.value)

						if (v instanceof promise) {
							v.then((res1) => {
								resolve(res1)
							}, rej1 => {
								reject(rej1)
							})
						} else {
							resolve(v)
						}
					} catch (e) {
						reject(e)
					}
				})
			})
		}
		else {
			return new promise((resolve, reject) => {
				process.nextTick(() => {
					try {
						const v = rej(this.value)

						if (v instanceof promise) {
							v.then((res1) => {
								resolve(res1)
							}, rej1 => {
								reject(rej1)
							})
						} else {
							resolve(v)
						}
					} catch (e) {
						reject(e)
					}
				})
			})
		}
	}

	static resolve (res) {
		return new promise(resolve => {
			resolve(res)
		})
	}

	static reject (rej) {
		return new promise((resolve, reject) => {
			reject(rej)
		})
	}
}

Promise = promise

let p = new Promise((resolve, reject) => {
	reject(3000)
})

p.then(res => {
	console.log(res, 1)
}, rej => {
	console.log('error', 1)
})

p.then(res => {
	console.log(res, 2)
}, rej => {
	console.log('error', 2)
})

p.then(res => {
	console.log(res, 3)
}, rej => {
	console.log('error', 3)
})

setTimeout(() => {
	p.then((res) => {
		console.log(res, 5)
	}, err => {
		throw 1
	}).then((res) => {
		console.log(res, 6)
	})
}, 2000)


