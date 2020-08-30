import axios from '@/index'
import config from '@/examples/config'
import qs from 'qs'
import { AxiosTransformer } from '@/types/index.ts'

export default function start () {
    const instance = axios.create({
        transformRequest: [function (data) {
            return qs.stringify(data)
        }, ...(axios.defaults.transformRequest as AxiosTransformer[])],
        transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
            if (typeof data === 'object') {
                data.b = 2
            }
            return data
        }]
    })

    instance({
        url: `${config.baseUrl}/config/post`,
        method: 'post',
        data: {
            a: 1
        }
    }).then((res) => {
        console.log(res.data)
    })
}
