import axios from '../../index'
import config from '../config'

export default function start () {
    axios({
        method: 'post',
        url: `${config.baseUrl}/base/post`,
        data: {
            a: 1,
            b: 2
        }
    })

    const arr = new Int32Array([21, 31])

    axios({
        method: 'post',
        url: `${config.baseUrl}/base/buffer`,
        data: arr
    })
}
