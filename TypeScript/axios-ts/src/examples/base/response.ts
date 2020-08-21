import axios from '@/index'
import config from '@/examples/config'

export default function start () {
    axios({
        method: 'post',
        url: `${config.baseUrl}/base/post`,
        data: {
            a: 1,
            b: 2
        }
    }).then((res) => {
        console.log(res)
    })

    axios({
        method: 'post',
        url: `${config.baseUrl}/base/post`,
        responseType: 'json',
        data: {
            a: 3,
            b: 4
        }
    }).then((res) => {
        console.log(res)
    })
}
