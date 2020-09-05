import config from '@/examples/config'
import axios from '@/index'

export default function start () {
    axios.get(`${config.baseUrl}/more/302`).then(res => {
        console.log(res)
    }).catch((e) => {
        console.log(e.message)
    })

    axios.get(`${config.baseUrl}/more/302`, {
        validateStatus (status) {
            return status >= 200 && status < 400
        }
    }).then(res => {
        console.log(res)
    }).catch((e) => {
        console.log(e.message)
    })
}
