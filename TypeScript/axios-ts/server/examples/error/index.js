const Router = require('@koa/router')
const router = new Router()

router.get('/error/get', function (ctx) {
    if (Math.random() > 0.5) {
        ctx.body = {
            msg: 'hello world'
        }
    } else {
        ctx.status = 304
    }
})

router.get('/error/timeout', function (ctx) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()

            ctx.body = {
                msg: 'hello world'
            }
        }, 3000)
    })
})

module.exports = router
