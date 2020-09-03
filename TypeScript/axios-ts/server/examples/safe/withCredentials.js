const Router = require('@koa/router')
const router = new Router()

router.get('/more/get', function (ctx) {
    ctx.body = 'success'
})

module.exports = router
