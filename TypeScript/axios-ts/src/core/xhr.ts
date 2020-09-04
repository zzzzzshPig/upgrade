import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types/index'
import { createError } from '@/helpers/error'
import { transformResponseHeader } from '@/helpers/config'
import { isURLSameOrigin, isFormData } from '@/helpers/util'
import cookie from '@/helpers/cookie'

export default function xhr (config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url = '', method = 'get', headers } = config

        const request = new XMLHttpRequest()
        request.open(method.toUpperCase(), url, true)

        if (isFormData(data)) {
            delete headers['Content-Type']
        }

        // auth
        function auth () {
            const { auth } = config

            if (auth) {
                headers.Authorization = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }
        }
        auth()

        function timeout () {
            const { timeout } = config
            if (timeout) {
                request.timeout = timeout
            }
            request.ontimeout = () => {
                reject(createError(
                    `Timeout of ${timeout} ms exceeded`,
                    config,
                    undefined,
                    request
                ))
            }
        }
        timeout()

        function responseType () {
            const { responseType } = config
            // type
            if (responseType) {
                request.responseType = responseType
            }
        }
        responseType()

        // 进度处理
        function onprogress () {
            const { onDownloadProgress, onUploadProgress } = config

            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }

            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }
        onprogress()

        // xsrf
        function xsrf () {
            const { xsrfCookieName, xsrfHeaderName } = config

            if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)
                if (xsrfValue) {
                    headers[xsrfHeaderName!] = xsrfValue
                }
            }
        }
        xsrf()

        // cors cookies
        function withCredentials () {
            const { withCredentials } = config
            if (withCredentials) {
                request.withCredentials = true
            }
        }
        withCredentials()

        // cancel
        function cancelToken () {
            const { cancelToken } = config
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort()
                    reject(reason)
                })
            }
        }
        cancelToken()

        // set request headers
        setRequestHeader(request, headers)

        request.send(data)

        // onreadystatechange
        request.onreadystatechange = () => {
            if (request.readyState !== 4) return

            // network or timeout error
            if (request.status === 0) return

            const responseHeaders = transformResponseHeader(request.getAllResponseHeaders())
            const responseData = request.responseType && request.responseType !== 'text' ? request.response : request.responseText
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
                reject(createError(
                    `Request failed with status code ${response.status}`,
                    config,
                    undefined,
                    request,
                    response
                ))
            } else {
                resolve(response)
            }
        }

        // error
        request.onerror = () => {
            reject(createError(
                'Network Error',
                config,
                undefined,
                request
            ))
        }
    })
}

function setRequestHeader (request: XMLHttpRequest, headers: any) {
    Object.keys(headers).forEach((name) => {
        request.setRequestHeader(name, headers[name])
    })
}
