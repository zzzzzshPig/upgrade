let ENV = 'wx'

const wx = {
    getUserInfo () {
        return {
            username: 'zxl',
            age: 1,
            sex: '男',
            address: 'SZ'
        }
    },

    showLoading (ms) {
        setTimeout(() => {
            console.log('hideLoading')
        }, ms)
    }
}

const bd = {
    getUserInfo () {
        return {
            username: 'lyh',
            age: 0,
            sex: '男',
            address: 'BJ'
        }
    },

    showLoading (s) {
        setTimeout(() => {
            console.log('hideLoading')
        }, s * 1000)
    }
}

const wx_uni = {
    getUserInfo: wx.getUserInfo,
    showLoading: wx.showLoading
}

const bd_uni = {
    getUserInfo: bd.getUserInfo,
    showLoading (ms) {
        return bd.showLoading(ms / 1000)
    }
}

const apis = {
    wx: wx_uni,
    bd: bd_uni
}

const unis = new Proxy({}, {
    get (t, k) {
        return apis[ENV][k]
    },

    set () {
        throw new Error('can not set the uni props')
    }
})

console.log(unis.getUserInfo())
unis.showLoading(1000)

ENV = 'bd'

console.log(unis.getUserInfo())
unis.showLoading(2000)
