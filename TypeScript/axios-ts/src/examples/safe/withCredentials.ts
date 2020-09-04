import config from '@/examples/config'
import axios from '@/index'

export default function start () {
    document.cookie = 'a=b'

    axios.get(`${config.baseUrl}/withCredentials/get`, {
        withCredentials: true
    }).then(res => {
        console.log(res)
    })
}
