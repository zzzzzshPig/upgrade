const Router = require('@koa/router')
const router = new Router()

router.post('/extend/post', function (ctx) {
    ctx.body = ctx.request.body
})

router.get('/extend/get', function (ctx) {
    ctx.body = 'get'
})

router.options('/extend/options', function (ctx) {
    ctx.body = 'options'
})

router.delete('/extend/delete', function (ctx) {
    ctx.body = 'delete'
})

router.head('/extend/head', function (ctx) {
    ctx.body = 'head'
})

router.put('/extend/put', function (ctx) {
    ctx.body = ctx.request.body
})

router.patch('/extend/patch', function (ctx) {
    ctx.body = ctx.request.body
})

router.get('/extend/user', function (ctx) {
    ctx.body = {
        name: 'zzh',
        age: 18
    }
})

module.exports = router
