import { deepMerge, isPlainObject } from './util'
import { Method } from '@/types/index.ts'

export const HeaderName = {
    CONTENT_TYPE: 'Content-Type'
}

export function flattenHeaders (headers: any, method: Method): any {
    if (!headers) return headers

    headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

    methodsToDelete.forEach(method => {
        delete headers[method]
    })

    return headers
}

export function transformResponseHeader (headers: string) {
    headers = headers.slice(0, -1)

    const res: any = {}
    headers.split('\r\n').forEach(a => {
        let [key, ...values] = a.split(':')
        key = key.trim().toLowerCase()

        if (!key) return

        res[key.toLowerCase()] = values.join(':').trim()
    })
    return res
}

function normalizeHeaderName (headers: any, normalizedName: string): void {
    if (!headers) {
        return
    }

    for (const k in headers) {
        if (k.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[k]
            delete headers[k]
            break
        }
    }
}

export function processHeaders (headers: any, data: any) {
    if (!headers) return headers

    normalizeHeaderName(headers, HeaderName.CONTENT_TYPE)

    if (isPlainObject(data)) {
        // content-type
        if (!headers[HeaderName.CONTENT_TYPE]) {
            headers[HeaderName.CONTENT_TYPE] = 'application/json;charset=utf-8'
        }
    }

    return headers
}
