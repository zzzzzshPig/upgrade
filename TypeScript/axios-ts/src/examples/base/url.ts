import axios from '../../index'
import config from '../config'

export default function start () {
    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer`,
        params: {
            a: 1,
            c: 2
        }
    })

    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer`,
        params: {
            foo: ['bar', 'baz']
        }
    })

    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer`,
        params: {
            foo: {
                bar: 'baz'
            }
        }
    })

    const date = new Date()

    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer`,
        params: {
            date
        }
    })

    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer`,
        params: {
            foo: '@:$, '
        }
    })

    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer`,
        params: {
            foo: 'bar',
            baz: null
        }
    })

    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer#hash`,
        params: {
            foo: 'bar'
        }
    })

    axios({
        method: 'get',
        url: `${config.baseUrl}/getCustomer?foo=bar`,
        params: {
            bar: 'baz'
        }
    })
}
