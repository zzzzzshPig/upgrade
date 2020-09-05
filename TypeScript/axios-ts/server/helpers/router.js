const routers = ['base/url', 'base/body', 'error/index', 'extend/index', 'interceptor/index', 'config/merge', 'cancel/index', 'more/safe/withCredentials', 'more/safe/xsrf', 'more/uploadAndDownload/index', 'more/auth/index', 'more/httpStatus/index']

function getAllRouters () {
    const routes = []

    routers.forEach(a => {
        routes.push(require(`../examples/${a}`))
    })

    return routes
}

module.exports = {
    getAllRouters
}
