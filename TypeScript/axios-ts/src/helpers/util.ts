const toString = Object.prototype.toString

export function isDate (val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

// not use object in val
export function isPlainObject (val: any) {
    return toString.call(val) === '[object Object]'
}
