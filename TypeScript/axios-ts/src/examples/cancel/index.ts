import config from '@/examples/config'
import axios from '@/index'
import { Canceler } from '@/core/cancel/index.ts'

export default function start () {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    axios.get(`${config.baseUrl}/cancel/get`, {
        cancelToken: source.token
    }).catch(function (e) {
        if (axios.isCancel(e)) {
            console.log('Request canceled', e.message)
        }
    })

    setTimeout(() => {
        source.cancel('Operation canceled by the user.')

        // 该请求不会执行
        axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function (e) {
            if (axios.isCancel(e)) {
                console.log(e.message)
            }
        })
    }, 100)

    let cancel: Canceler

    axios.get(`${config.baseUrl}/cancel/get`, {
        cancelToken: new CancelToken(c => {
            cancel = c
        })
    }).catch(function (e) {
        if (axios.isCancel(e)) {
            console.log('Request canceled')
        }
    })

    setTimeout(() => {
        cancel()
    }, 200)
}
