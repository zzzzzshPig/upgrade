const Router = require('@koa/router')
const router = new Router()

router.get('/more/302', function (ctx) {
    ctx.status = 302
    ctx.body = '302'
})

module.exports = router
