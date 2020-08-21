import { AxiosRequestConfig } from '@/types/index.ts'
import { processHeaders } from '@/helpers/header'
import { transformRequest } from '@/helpers/data'
import { buildURL } from '@/helpers/url'

export function processConfig (config: AxiosRequestConfig): void {
    config.url = transformUrl(config)
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config)
}

export function transformHeaders (config: AxiosRequestConfig) {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}

export function transformRequestData (config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}

function transformUrl (config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url, params)
}

export function transformResponseHeader (headers: string) {
    headers = headers.slice(0, -1)

    const res: any = {}
    headers.split('\r\n').forEach(a => {
        const [key, value] = a.split(': ')
        if (!key || !value) return

        res[key.toLowerCase()] = value
    })
    return res
}

export function transformResponseData (data: any, request: XMLHttpRequest) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (e) {}
    }
    return data
}
