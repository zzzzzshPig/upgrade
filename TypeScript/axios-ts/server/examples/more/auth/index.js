const Router = require('@koa/router')
const router = new Router()

router.post('/auth/post', (ctx) => {
    const auth = ctx.headers.authorization
    const [type, credentials] = auth.split(' ')
    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')

    if (type === 'Basic' && username === 'zzh' && password === '123456') {
        ctx.body = ctx.request.body
    } else {
        ctx.status = 401
        ctx.body = 'UnAuthorization'
    }
})

module.exports = router
