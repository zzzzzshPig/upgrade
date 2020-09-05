const toString = Object.prototype.toString

export function isDate (val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

export function isFormData (val: any): boolean {
    return typeof val !== 'undefined' && val instanceof FormData
}

// not use object in val
export function isPlainObject (val: any) {
    return toString.call(val) === '[object Object]'
}

// b -> a
export function extend <T, U> (a: T, b: U): T & U {
    for (const key in b) {
        (a as T & U)[key] = b[key] as any
    }
    return a as T & U
}

interface URLOrigin {
    protocol: string
    host: string
}

export function isURLSameOrigin (requestURL: string): boolean {
    const parsedOrigin = resolveURL(requestURL)
    return (
        parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
    )
}

export function isURLSearchParams (val: any): val is URLSearchParams {
    return typeof val !== 'undefined' && val instanceof URLSearchParams
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL (url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    const { protocol, host } = urlParsingNode

    return {
        protocol,
        host
    }
}

export function isAbsoluteURL (url: string): boolean {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

export function combineURL (baseURL: string, relativeURL?: string): string {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
