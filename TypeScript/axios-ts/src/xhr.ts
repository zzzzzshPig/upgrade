import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types/index'

export default function xhr (config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, responseType } = config

        const request = new XMLHttpRequest()

        if (responseType) {
            request.responseType = responseType
        }

        request.open(method.toUpperCase(), url, true)

        // set request headers
        setRequestHeader(request, headers)

        request.send(data)

        request.onreadystatechange = () => {
            if (request.readyState !== 4) return

            const responseHeaders = request.getAllResponseHeaders()
            const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            resolve(response)
        }
    })
}

function setRequestHeader (request: XMLHttpRequest, headers: any) {
    Object.keys(headers).forEach((name) => {
        request.setRequestHeader(name, headers[name])
    })
}
