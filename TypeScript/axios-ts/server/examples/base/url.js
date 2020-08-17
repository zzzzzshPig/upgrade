const Router = require('@koa/router')
const router = new Router()

router.get('/getCustomer', (ctx, next) => {
    ctx.body = ctx.query
})

module.exports = router
