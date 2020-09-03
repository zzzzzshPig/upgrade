const routers = ['base/url', 'base/body', 'error/index', 'extend/index', 'interceptor/index', 'config/merge', 'cancel/index', 'safe/withCredentials', 'safe/xsrf']

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
