const Router = require('@koa/router')
const router = new Router()

router.get('/xsrf/get', function (ctx) {
    ctx.cookies.set('XSRF-TOKEN-D', '1234abc', {
        httpOnly: false
    })
    ctx.body = 'success'
})

module.exports = router
