import { AxiosPromise, AxiosRequestConfig } from './types/index'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'
import xhr from './xhr'

function axios (config: AxiosRequestConfig): AxiosPromise {
    processConfig(config)
    return xhr(config)
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

export default axios
