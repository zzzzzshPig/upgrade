const Router = require('@koa/router')
const router = new Router()

router.get('/cancel/get', (ctx) => {
    ctx.body = 'success'
})

router.post('/cancel/post', (ctx) => {
    ctx.body = 'success'
})

module.exports = router
