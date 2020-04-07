const {isFunction} = require('./utils')

class Promise {
    constructor (fn) {
        if (!isFunction(fn)) throw new TypeError('Promise resolver undefined is not a function')

        this.status = 'pending'
        this.value = undefined
        this.thenRes = undefined
        this.thenRej = undefined

        const resolve = (res) => {
            if (this.status !== 'pending') return
            this.status = 'resolve'
            this.value = res

            process.nextTick(() => {
                if (isFunction(this.thenRes)) this.thenRes(this.value)
            })
        }

        const reject = (err) => {
            if (this.status !== 'pending') return
            this.status = 'reject'
            this.value = err

            process.nextTick(() => {
                if (isFunction(this.thenRej)) this.thenRej(this.value)
            })
        }

        try {
            fn(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    // [res], [err]
    then (res, rej) {
        return new Promise((resolve, reject) => {
            this.thenRes = (value) => {
                try {
                    if (isFunction(res)) {
                        let thenValue = res(value)
                        thenValue = thenValue === undefined ? value : thenValue

                        // value is promise.reject then...
                        resolve(thenValue)
                    } else {
                        resolve(value)
                    }
                } catch (e) {
                    reject(e)
                }
            }

            this.thenRej = (value) => {
                try {
                    if (isFunction(rej)) {
                        let thenValue = rej(value)
                        thenValue = thenValue === undefined ? value : thenValue

                        // value is promise.resolve then...
                        reject(thenValue)
                    } else {
                        reject(value)
                    }
                } catch (e) {
                    reject(e)
                }
            }
        })
    }
}

const p = new Promise((resolve, reject) => {
    resolve('resolve')
})

p.then((res) => {
    console.log(res)
}).then((res) => {
    console.log(res)
}).then((res) => {
    console.log(res)
}).then((res) => {
    console.log(res)
    throw 1
})

setTimeout(() => {
    p.then(() => {}, err => {console.log(err)})
}, 1000)
