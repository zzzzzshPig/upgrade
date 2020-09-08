const toString = Object.prototype.toString

export function deepMerge (...objs: any[]) {
    const result = {} as any

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

export function isURLSearchParams (val: any): val is URLSearchParams {
    return typeof val !== 'undefined' && val instanceof URLSearchParams
}
