import xhr from '@/core/xhr'
import { AxiosRequestConfig, BaseFunction, AxiosResponse, ResolvedFn, AxiosPromise, RejectedFn } from '@/types/index.ts'
import { mergeConfig, processConfig } from '@/helpers/config'
import InterceptorManager from './interceptor'
import transform from './transform'
import CancelToken from './cancel/index'
import Cancel, { isCancel } from './cancel/cancel'
import { getUri } from '@/helpers/url'

interface PromiseChain {
    resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default function getBase (initConfig: AxiosRequestConfig) {
    const Base: BaseFunction = function (url: string | AxiosRequestConfig, config?: AxiosRequestConfig) {
        let conf = config || initConfig || {}

        if (typeof url === 'string') {
            conf.url = url
        } else {
            conf = url
        }

        return Base.request(conf)
    }

    Base.CancelToken = CancelToken
    Base.Cancel = Cancel
    Base.isCancel = isCancel

    Base.defaults = initConfig

    Base.getUri = (config) => getUri(config)

    Base.interceptors = {
        request: new InterceptorManager<AxiosRequestConfig>(),
        response: new InterceptorManager<AxiosResponse>()
    }

    function dispatchRequest (config: AxiosRequestConfig) {
        if (config.cancelToken) {
            config.cancelToken.throwIfRequested()
        }
        config = mergeConfig(Base.defaults, config)
        processConfig(config)

        return xhr(config).then(res => {
            res.data = transform(res.data, res.headers, res.config.transformResponse)
            return res
        })
    }

    Base.create = function (config: AxiosRequestConfig) {
        return getBase(mergeConfig(Base.defaults, config))
    }

    Base.request = function (config: AxiosRequestConfig) {
        const chain: PromiseChain[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]

        Base.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })

        Base.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(config)

        while (chain.length) {
            const { resolved, rejected } = chain.shift()!
            promise = promise.then(resolved, rejected)
        }

        return promise as any
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
