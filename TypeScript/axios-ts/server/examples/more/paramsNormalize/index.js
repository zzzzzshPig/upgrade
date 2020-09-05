const Router = require('@koa/router')
const router = new Router()

router.get('/params/get', function (ctx) {
    ctx.body = ctx.query
})

module.exports = router
