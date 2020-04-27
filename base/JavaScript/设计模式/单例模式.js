class Vuex {
    static install () {
        // 一些install 操作
        console.log('install成功')

        Vuex.install = function () {
            console.log('install失败，只能是单例。')
        }
    }
}

const Vue = {
    use (fn) {
        fn.install()
    }
}

Vue.use(Vuex)
Vue.use(Vuex)
