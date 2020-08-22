import axios from '@/index'
import config from '@/examples/config'

export default function start () {
    axios({
        url: `${config.baseUrl}/extend/post`,
        method: 'post',
        data: {
            msg: 'hi'
        }
    })

    axios.request({
        url: `${config.baseUrl}/extend/post`,
        method: 'post',
        data: {
            msg: 'hello'
        }
    })

    axios.get(`${config.baseUrl}/extend/get`)

    axios.options(`${config.baseUrl}/extend/options`)

    axios.delete(`${config.baseUrl}/extend/delete`)

    axios.head(`${config.baseUrl}/extend/head`)

    axios.post(`${config.baseUrl}/extend/post`, { msg: 'post' })

    axios.put(`${config.baseUrl}/extend/put`, { msg: 'put' })

    axios.patch(`${config.baseUrl}/extend/patch`, { msg: 'patch' })
}
