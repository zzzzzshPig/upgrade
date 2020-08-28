import axios from '@/index'
import config from '@/examples/config'
import qs from 'qs'

export default function start () {
    axios.defaults.headers.common.test = 123

    axios({
        url: `${config.baseUrl}/config/post`,
        method: 'post',
        data: qs.stringify({
            a: 1
        }),
        headers: {
            test: '321'
        }
    }).then((res) => {
        console.log(res.data)
    })
}
