const Router = require('@koa/router')
const router = new Router()
const koaBody = require('koa-body')
const path = require('path')

router.post('/more/upload', koaBody({
    multipart: true, // 支持文件上传
    encoding: 'gzip',
    formidable: {
        uploadDir: path.join(__dirname, 'upload-file'), // 设置文件上传目录
        keepExtensions: true // 保持文件的后缀
    }
}), (ctx) => {
    ctx.body = 'upload success!'
})

module.exports = router
