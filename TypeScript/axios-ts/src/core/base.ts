import xhr from '@/core/xhr'
import { AxiosRequestConfig, BaseFunction, AxiosResponse, ResolvedFn, AxiosPromise, RejectedFn } from '@/types/index.ts'
import { mergeConfig, processConfig } from '@/helpers/config'
import InterceptorManager from './interceptor'
import defaults from '@/core/default'
import transform from './transform'

interface PromiseChain {
    resolved: ResolvedFn | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default function getBase (initConfig: AxiosRequestConfig) {
    const Base: BaseFunction = function (url: string | AxiosRequestConfig, config?: AxiosRequestConfig) {
        let conf = config || {}

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

    Base.defaults = initConfig

    Base.interceptors = {
        request: new InterceptorManager<AxiosRequestConfig>(),
        response: new InterceptorManager<AxiosResponse>()
    }

    Base.create = function (config: AxiosRequestConfig) {
        return getBase(mergeConfig(defaults, config))
    }

    Base.request = function (config: AxiosRequestConfig) {
        config = mergeConfig(Base.defaults, config)
        processConfig(config)

        return xhr(config).then(res => {
            res.data = transform(res.data, res.headers, res.config.transformResponse)
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
