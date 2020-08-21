const routers = ['base/url', 'base/body', 'error/index', 'extend/index']

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
