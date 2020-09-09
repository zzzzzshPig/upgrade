const Router = require('@koa/router')
const router = new Router()

router.get('/test/foo', function (ctx) {
    ctx.body = 'success'
})

router.post('/test/foo', function (ctx) {
    ctx.body = 'success'
})

router.put('/test/foo', function (ctx) {
    ctx.body = 'success'
})

router.patch('/test/foo', function (ctx) {
    ctx.body = 'success'
})

router.head('/test/foo', function (ctx) {
    ctx.body = 'success'
})

router.delete('/test/foo', function (ctx) {
    ctx.body = 'success'
})

router.options('/test/foo', function (ctx) {
    ctx.body = 'success'
})

router.get('/test/foo/bar', function (ctx) {
    ctx.body = 'success'
})

router.post('/test/foo/bar', function (ctx) {
    ctx.body = 'success'
})

router.get('/test/foo/reject', function (ctx) {
    ctx.status = 500
})

router.post('/api/account/signup', function (ctx) {
    ctx.body = {
        a: 1
    }
})

module.exports = router
