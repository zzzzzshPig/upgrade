import { isPlainObject } from './util'

export const HeaderName = {
    CONTENT_TYPE: 'Content-Type'
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
    if (!headers) return

    normalizeHeaderName(headers, HeaderName.CONTENT_TYPE)

    if (isPlainObject(data)) {
        // content-type
        if (!headers[HeaderName.CONTENT_TYPE]) {
            headers[HeaderName.CONTENT_TYPE] = 'application/json;charset=utf-8'
        }
    }

    return headers
}
