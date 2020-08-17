const Router = require('@koa/router')
const router = new Router()

function getBuffer (request) {
    return new Promise((resolve, reject) => {
        const msg = []

        request.on('data', (chunk) => {
            if (chunk) {
                msg.push(chunk)
            }
        })

        request.on('end', () => {
            const buf = Buffer.concat(msg)
            resolve(buf)
        })

        request.on('error', reject)
    })
}

router.post('/base/post', (ctx) => {
    ctx.body = ctx.request.body
})

router.post('/base/buffer', async (ctx) => {
    try {
        const buf = await getBuffer(ctx.req)
        ctx.body = buf.toJSON().data
    } catch (e) {
        console.log(e)
        throw e
    }
})

module.exports = router
