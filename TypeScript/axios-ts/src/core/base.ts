import xhr from '@/core/xhr'
import { AxiosRequestConfig, BaseFunction, AxiosResponse, ResolvedFn, AxiosPromise, RejectedFn } from '@/types/index.ts'
import { processConfig, transformResponseHeader, transformResponseData } from '@/helpers/config'
import InterceptorManager from './interceptor'

interface PromiseChain {
    resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default function getBase () {
    const Base: BaseFunction = function (url: string | AxiosRequestConfig, config?: Omit<AxiosRequestConfig, 'url'>) {
        let conf = (config || {}) as AxiosRequestConfig

        if (typeof url === 'string') {
            conf.url = url
        } else {
            conf = url
        }

        const chain: PromiseChain[] = [{
            resolved: Base.request,
            rejected: undefined
        }]

        Base.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })

        Base.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(conf)

        while (chain.length) {
            const { resolved, rejected } = chain.shift()!
            promise = promise.then(resolved, rejected)
        }

        return promise as any
    }

    Base.interceptors = {
        request: new InterceptorManager<AxiosRequestConfig>(),
        response: new InterceptorManager<AxiosResponse>()
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
