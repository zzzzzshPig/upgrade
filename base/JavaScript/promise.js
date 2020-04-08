const {isFunction, getType} = require('./utils')
const promiseAplusTests = require('promises-aplus-tests')
const assert = require('assert')

class promise {
	constructor (fn) {
		if (!isFunction(fn)) throw TypeError('Promise resolver undefined is not a function')

		this.status = 'pending'
		this.value = undefined
		this.thenRes = []
		this.thenRej = []

		const resolve = (value) => {
			if (value instanceof promise) {
				return value.then(resolve, reject)
			}

			process.nextTick(() => {
				if (this.status !== 'pending') return
				this.status = 'resolve'
				this.value = value

				for (let res of this.thenRes) {
					res(this.value)
				}

				this.thenRes = null
			})
		}

		const reject = (error) => {
			process.nextTick(() => {
				if (this.status !== 'pending') return
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
			res = (v) => {return v}
		}

		if (!isFunction(rej)) {
			rej = (err) => {throw err}
		}

		let promise2 = null

		function resolvePromise (resolve, reject, value, v) {
			if (value === v) {
				return reject(new TypeError('Chaining cycle detected for promise!'))
			}

			if (v instanceof promise) {
				v.then((res) => {
					resolve(res)
				}, rej => {
					reject(rej)
				})
			}

			// 返回值有then方法 会调用then
			const type = getType(v)
			if (type === 'object' || type === 'function') {
				try {
					let then = v.then
					let status = 'pending'

					if (isFunction(then)) {
						then.call(v, function (v1) {
							if (status !== 'pending') return
							status = 'resolve'
							return resolvePromise(resolve, reject, value, v1)
						}, function (err) {
							if (status !== 'pending') return
							status = 'reject'
							return reject(err)
						})
					} else {
						resolve(v)
					}
				} catch (e) {
					if (status !== 'pending') return
					status = 'reject'
					reject(e)
				}
			} else {
				resolve(v)
			}
		}

		if (this.status === 'pending') {
			return promise2 = new promise((resolve, reject) => {
				this.thenRes.push((value) => {
					try {
						const v = res(value)

						resolvePromise(resolve, reject, promise2, v)
					} catch (e) {
						reject(e)
					}
				})

				this.thenRej.push((value) => {
					try {
						const v = rej(value)

						resolvePromise(resolve, reject, promise2, v)
					} catch (e) {
						reject(e)
					}
				})
			})
		}
		else if (this.status === 'resolve') {
			return promise2 = new promise((resolve, reject) => {
				process.nextTick(() => {
					try {
						const v = res(this.value)

						resolvePromise(resolve, reject, promise2, v)
					} catch (e) {
						reject(e)
					}
				})
			})
		}
		else {
			return promise2 = new promise((resolve, reject) => {
				process.nextTick(() => {
					try {
						const v = rej(this.value)

						resolvePromise(resolve, reject, promise2, v)
					} catch (e) {
						reject(e)
					}
				})
			})
		}
	}

	catch (rej) {
	    return this.then(null, rej)
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

Promise = Promise

function xFactory() {
	let x =  {
		then: function (onFulfilled, onRejected) {
			onFulfilled({
				then: function (onFulfilled) {
					onFulfilled(null);
				}
			})
		}
	}

	return x
}

var test = new Promise((resolve, reject) => {
	resolve({})
}).then(function () {
	return xFactory()
})

test.then(function (res) {
})

if (true) {
	promiseAplusTests({
		deferred () {
			let reject = null
			let resolve = null
			const p = new promise((res, rej) => {
				resolve = res
				reject = rej
			})

			return {
				promise: p,
				resolve: resolve,
				reject: reject
			}
		}
	}, function (err) {
		console.log(err)
	})

}
