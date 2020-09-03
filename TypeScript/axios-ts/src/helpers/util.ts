const toString = Object.prototype.toString

export function isDate (val: any): val is Date {
    return toString.call(val) === '[object Date]'
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
