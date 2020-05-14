const request = require('request')

function ajax (method, url, body, success, fail) {
    adapterAjax(method, url, body, success, fail)
}

async function adapterAjax (method, url, body, success, fail) {
    try {
        const data = await adapterFetch(url, {
            method,
            body
        })
        success && success(data)
    } catch (e) {
        fail && fail(e)
    }
}

function adapterFetch (url, options) {
    if (process) {
        return new Promise((resolve, reject) => {
            request(url, {
                method: options.method,
                data: options.body
            }, function (err, res, body) {
                if (err) {
                    reject(err)
                    return
                }
                resolve(body)
            }
            )
        })
    } else {
        return fetch(url, options)
    }
}

ajax('get', 'https://juejin.im/', {}, console.log.bind(null, 'success'), console.log.bind(null, 'fail'))
