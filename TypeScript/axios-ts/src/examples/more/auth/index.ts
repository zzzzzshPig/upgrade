import config from '@/examples/config'
import axios from '@/index'

export default function start () {
    axios.post(`${config.baseUrl}/auth/post`, {
        a: 1
    }, {
        auth: {
            username: 'zzh',
            password: '123456'
        }
    }).then(res => {
        console.log(res)
    })

    axios.post(`${config.baseUrl}/auth/post`, {
        a: 1
    }, {
        auth: {
            username: 'zzh',
            password: 'xxxx'
        }
    }).then(res => {
        console.log(res)
    })
}
