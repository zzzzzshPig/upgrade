const toString = Object.prototype.toString

export function isDate (val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

// not use object in val
export function isObject (val: any) {
    return val !== null && typeof val === 'object'
}
