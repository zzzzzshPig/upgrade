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

    axios({
        method: 'post',
        url: `${config.baseUrl}/base/post`,
        headers: {
            'content-type': 'application/json'
        },
        data: {
            a: 1,
            b: 2
        }
    })

    const paramsString = 'q=URLUtils.searchParams&topic=api'
    const searchParams = new URLSearchParams(paramsString)

    axios({
        method: 'post',
        url: `${config.baseUrl}/base/post`,
        data: searchParams
    })
}
