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
