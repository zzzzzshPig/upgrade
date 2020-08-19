import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types/index'

export default function xhr (config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, responseType, timeout } = config

        const request = new XMLHttpRequest()

        if (responseType) {
            request.responseType = responseType
        }

        request.open(method.toUpperCase(), url, true)

        // set request headers
        setRequestHeader(request, headers)

        // timeout
        if (timeout) {
            request.timeout = timeout
        }
        request.ontimeout = () => {
            reject(new Error(`Timeout of ${timeout} ms exceeded`))
        }

        request.send(data)

        request.onreadystatechange = () => {
            if (request.readyState !== 4) return

            // network or timeout error
            if (request.status === 0) return

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

            // error
            // TODO 304状态码应该resolve
            if (response.status < 200 || response.status >= 300) {
                reject(new Error(`Request failed with status code ${response.status}`))
            } else {
                resolve(response)
            }
        }

        // error
        request.onerror = () => {
            reject(new Error('Network Error'))
        }
    })
}

function setRequestHeader (request: XMLHttpRequest, headers: any) {
    Object.keys(headers).forEach((name) => {
        request.setRequestHeader(name, headers[name])
    })
}
