const Router = require('@koa/router')
const router = new Router()

router.get('/interceptor/get', function (ctx) {
    ctx.body = 'interceptor'
})

module.exports = router
