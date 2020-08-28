const Router = require('@koa/router')
const router = new Router()

router.post('/config/post', function (ctx) {
    ctx.body = ctx.request.body
})

module.exports = router
