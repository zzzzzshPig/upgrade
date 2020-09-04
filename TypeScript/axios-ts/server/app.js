const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { getAllRouters } = require('./helpers/router')
const cors = require('@koa/cors')

const app = new Koa()

app.use(cors({
    credentials: true
}))

app.use(bodyParser())

getAllRouters().forEach(a => {
    app.use(a.routes()).use(a.allowedMethods())
})

app.listen(3000, () => {
    console.log('listen on the 3000 port')
})
