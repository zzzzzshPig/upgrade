import config from '@/examples/config'
import axios from '@/index'
import qs from 'qs'

export default function start () {
    axios.get(`${config.baseUrl}/params/get`, {
        params: new URLSearchParams('a=b&c=d')
    }).then(res => {
        console.log(res)
    })

    axios.get(`${config.baseUrl}/params/get`, {
        params: {
            a: 1,
            b: 2,
            c: ['a', 'b', 'c']
        }
    }).then(res => {
        console.log(res)
    })

    const instance = axios.create({
        paramsSerializer (params) {
            return qs.stringify(params, { arrayFormat: 'brackets' })
        }
    })

    instance.get(`${config.baseUrl}/params/get`, {
        params: {
            a: 1,
            b: 2,
            c: ['a', 'b', 'c']
        }
    }).then(res => {
        console.log(res)
    })
}
