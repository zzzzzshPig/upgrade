import { AxiosPromise, AxiosRequestConfig } from './types/index'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'
import xhr from './xhr'

function axios (config: AxiosRequestConfig): AxiosPromise {
    processConfig(config)
    return xhr(config).then(res => {
        res.headers = transformResponseHeader(res.headers)
        res.data = transformResponseData(res.data, res.request)
        return res
    })
}

function processConfig (config: AxiosRequestConfig): void {
    config.url = transformUrl(config)
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config)
}

function transformHeaders (config: AxiosRequestConfig) {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}

function transformRequestData (config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}

function transformUrl (config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}

function transformResponseHeader (headers: string) {
    headers = headers.slice(0, -1)

    const res: any = {}
    headers.split('\r\n').forEach(a => {
        const [key, value] = a.split(': ')
        if (!key || !value) return

        res[key.toLowerCase()] = value
    })
    return res
}

function transformResponseData (data: any, request: XMLHttpRequest) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (e) {}
    }
    return data
}

export default axios
