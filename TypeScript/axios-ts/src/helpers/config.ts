import { AxiosRequestConfig, Method } from '@/types/index.ts'
import { buildURL, isAbsoluteURL, combineURL } from '@/helpers/url'
import { isPlainObject, deepMerge } from './util'
import transform from '@/core/transform'
import { flattenHeaders } from './header'

export function processConfig (config: AxiosRequestConfig) {
    config.url = transformUrl(config)
    config.data = transform(config.data, config.headers, config.transformRequest)
    config.headers = transformHeaders(config)
    config.method = config.method && config.method.toLowerCase() as Method
}

function transformHeaders (config: AxiosRequestConfig) {
    const headers = flattenHeaders(config.headers, config.method!) || {}

    if (config.data === undefined) {
        delete headers['Content-Type']
    }

    return headers
}

function transformUrl (config: AxiosRequestConfig) {
    let { url = '', params, paramsSerializer, baseURL } = config

    if (baseURL && !isAbsoluteURL(url)) {
        url = combineURL(baseURL, url)
    }

    return buildURL(url, params, paramsSerializer)
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
    const config = {} as any

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
    } else {
        return val1
    }
}
