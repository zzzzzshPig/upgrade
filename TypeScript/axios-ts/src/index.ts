import { AxiosRequestConfig } from './types/index'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import xhr from './xhr'

function axios (config: AxiosRequestConfig): void {
    processConfig(config)
    xhr(config)
}

function processConfig (config: AxiosRequestConfig): void {
    config.url = transformUrl(config)
    config.data = transformRequestData(config)
}

function transformRequestData (config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}

function transformUrl (config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}

export default axios
