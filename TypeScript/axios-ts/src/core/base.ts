import xhr from '@/core/xhr'
import { AxiosRequestConfig, BaseFunction } from '@/types/index.ts'
import { processConfig, transformResponseHeader, transformResponseData } from '@/helpers/config'

export default function getBase () {
    const Base: BaseFunction = function (url: string | AxiosRequestConfig, config?: Omit<AxiosRequestConfig, 'url'>) {
        let conf = (config || {}) as AxiosRequestConfig

        if (typeof url === 'string') {
            conf.url = url
        } else {
            conf = url
        }

        return Base.request(conf)
    }

    Base.create = function () {
        return getBase()
    }

    Base.request = function (config: AxiosRequestConfig) {
        processConfig(config)
        return xhr(config).then(res => {
            res.headers = transformResponseHeader(res.headers)
            res.data = transformResponseData(res.data, res.request)
            return res
        })
    }

    Base.delete = function (url: string, config?: AxiosRequestConfig) {
        return this.request({
            ...config,
            method: 'delete',
            url
        })
    }

    Base.get = function (url: string, config?: AxiosRequestConfig) {
        return this.request({
            ...config,
            method: 'get',
            url
        })
    }

    Base.head = function (url: string, config?: AxiosRequestConfig) {
        return this.request({
            ...config,
            method: 'head',
            url
        })
    }

    Base.options = function (url: string, config?: AxiosRequestConfig) {
        return this.request({
            ...config,
            method: 'options',
            url
        })
    }

    Base.post = function (url: string, data?:any, config?: AxiosRequestConfig) {
        return this.request({
            ...config,
            method: 'post',
            url,
            data
        })
    }

    Base.put = function (url: string, data?:any, config?: AxiosRequestConfig) {
        return this.request({
            ...config,
            method: 'put',
            url,
            data
        })
    }

    Base.patch = function (url: string, data?:any, config?: AxiosRequestConfig) {
        return this.request({
            ...config,
            method: 'patch',
            url,
            data
        })
    }

    return Base
}
