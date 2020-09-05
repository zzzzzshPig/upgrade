const routers = ['base/url', 'base/body', 'error/index', 'extend/index', 'interceptor/index', 'config/merge', 'cancel/index', 'safe/withCredentials', 'safe/xsrf', 'uploadAndDownload/index', 'auth/index', 'httpStatus/index']

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
