import axios from '@/index'
import qs from 'qs'
import { AxiosTransformer } from '@/types/index.ts'
import config from '@/examples/config'

export default function start () {
    axios({
        transformRequest: [function (data) {
            return qs.stringify(data)
        }, ...(axios.defaults.transformRequest as AxiosTransformer[])],
        transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
            if (typeof data === 'object') {
                data.b = 2
            }
            return data
        }],
        url: `${config.baseUrl}/config/post`,
        method: 'post',
        data: {
            a: 1
        }
    }).then((res) => {
        console.log(res.data)
    })
}
