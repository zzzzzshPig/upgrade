import { AxiosRequestConfig, Method } from '@/types/index.ts'
import { buildURL } from '@/helpers/url'
import { isPlainObject, isAbsoluteURL, combineURL } from './util'
import transform from '@/core/transform'

export function processConfig (config: AxiosRequestConfig) {
    config.url = transformUrl(config)
    config.data = transform(config.data, config.headers, config.transformRequest)
    config.headers = flattenHeaders(config.headers, config.method!)
}

function flattenHeaders (headers: any, method: Method): any {
    if (!headers) {
        return headers
    }
    headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

    methodsToDelete.forEach(method => {
        delete headers[method]
    })

    return headers
}

function transformUrl (config: AxiosRequestConfig) {
    let { url = '', params, paramsSerializer, baseURL } = config

    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURL(baseURL, url)
    }

    return buildURL(url, params, paramsSerializer)
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

const strats: {
    [index: string]: any
} = {}

function defaultStrat (val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat (val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
        return val2
    }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergeStrat
})

export function mergeConfig (
    config1: AxiosRequestConfig,
    config2: AxiosRequestConfig = {}
): AxiosRequestConfig {
    const config = Object.create(null)

    for (const key in config2) {
        mergeField(key)
    }

    for (const key in config1) {
        if (!config2[key]) {
            mergeField(key)
        }
    }

    function mergeField (key: string) {
        const strat = strats[key] || defaultStrat
        config[key] = strat(config1[key], config2[key])
    }

    return config
}

function deepMergeStrat (val1: any, val2: any) {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
        return val2
    } else if (isPlainObject(val1)) {
        return deepMerge(val1)
    } else if (typeof val1 !== 'undefined') {
        return val1
    }
}

export function deepMerge (...objs: any[]) {
    const result = Object.create(null)

    objs.forEach(obj => {
        if (!obj) { return }

        Object.keys(obj).forEach(key => {
            const val = obj[key]

            if (isPlainObject(val)) {
                if (isPlainObject(result[key])) {
                    result[key] = deepMerge(result[key], val)
                } else {
                    result[key] = deepMerge({}, val)
                }
            } else {
                result[key] = val
            }
        })
    })

    return result
}
