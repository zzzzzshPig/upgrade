import axios from '../../index'
import config from '../config'
import { AxiosError } from '../../helpers/error'

export default function start () {
    axios({
        method: 'get',
        url: `${config.baseUrl}/error/get1`
    }).then((res) => {
        console.log(res)
    }).catch((e: AxiosError) => {
        console.dir(e)
    })

    axios({
        method: 'get',
        url: `${config.baseUrl}/error/get`
    }).then((res) => {
        console.log(res)
    }).catch((e) => {
        console.log(e)
    })

    setTimeout(() => {
        axios({
            method: 'get',
            url: `${config.baseUrl}/error/get`
        }).then((res) => {
            console.log(res)
        }).catch((e) => {
            console.log(e)
        })
    }, 5000)

    axios({
        method: 'get',
        url: `${config.baseUrl}/error/timeout`,
        timeout: 2000
    }).then((res) => {
        console.log(res)
    }).catch((e) => {
        console.log(e)
    })
}
