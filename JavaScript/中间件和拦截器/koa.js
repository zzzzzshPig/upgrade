const { sleep } = require('../utils')

class Koa {
    // The items in the queue may be promises
    constructor () {
        this.context = {}
        this.queue = []
    }

    use (fn) {
        this.queue.push(fn)
    }

    run (ctx) {
        this.context = ctx
        this.next(0)
    }

    next (i) {
        if (i === this.queue.length) return

        return this.queue[i](this.context, this.next.bind(this, i + 1))
    }
}

const koa = new Koa()

koa.use(async (ctx, next) => {
    try {
        // 这里的next包含了第二层以及第三层的运行
        await next()
    } catch (error) {
        console.log(`[koa error]: ${error.message}`)
    }
})

koa.use(async (ctx, next) => {
    const { req } = ctx
    console.log(`req is ${JSON.stringify(req)}`)
    await next()
    // next过后已经能拿到第三层写进ctx的数据了
    console.log(`res is ${JSON.stringify(ctx.res)}`)
})

koa.use(async (ctx, next) => {
    const { req } = ctx
    console.log(`calculating the res of ${req}...`)
    const res = {
        code: 200,
        result: `req ${req} success`
    }
    // 写入ctx
    ctx.res = res
    await next()
})

koa.run({ req: 'ssh' })
