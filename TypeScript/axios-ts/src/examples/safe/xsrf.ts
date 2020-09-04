import config from '@/examples/config'
import axios from '@/index'

export default function start () {
    const instance = axios.create({
        xsrfCookieName: 'XSRF-TOKEN-D',
        xsrfHeaderName: 'X-XSRF-TOKEN-D'
    })

    instance.get(`${config.baseUrl}/xsrf/get`, {
        withCredentials: true
    }).then(res => {
        console.log(res)
    })
}
