import { AxiosRequestConfig } from '@/types/index.ts'
import { processHeaders } from '@/helpers/header'
import { transformRequestData, transformResponseData } from '@/helpers/data'

const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    transformRequest: [
        function (data: any, headers: any): any {
            processHeaders(headers, data)
            return transformRequestData(data)
        }
    ],
    transformResponse: [
        function (data: any): any {
            return transformResponseData(data)
        }
    ]
}

const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
    defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults
