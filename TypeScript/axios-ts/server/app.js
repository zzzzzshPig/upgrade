const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { getAllRouters } = require('./helpers/router')

const app = new Koa()

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

    if (ctx.method === 'OPTIONS') {
        ctx.body = 200
    } else {
        await next()
    }
})

app.use(bodyParser())

getAllRouters().forEach(a => {
    app.use(a.routes()).use(a.allowedMethods())
})

app.listen(3000, () => {
    console.log('listen on the 3000 port')
})
