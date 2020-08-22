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

    axios(`${config.baseUrl}/extend/post`, {
        method: 'post',
        data: {
            msg: 'hello'
        }
    })
}
