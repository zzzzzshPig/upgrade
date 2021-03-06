const { isObject, isArray } = require('./utils')

function deepCopy (obj) {
    if (!isObject(obj) && !isArray(obj)) return obj

    const res = isObject(obj) ? {} : []

    for (const k in obj) {
        if (isObject(obj) || isArray(obj)) {
            res[k] = deepCopy(obj[k])
        } else {
            res[k] = obj[k]
        }
    }

    return res
}

const a = {
    b: {
        c: 1,
        cc: {
            ccc: 2
        }
    },
    d: [0, {
        e: 2
    }]
}

const b = deepCopy(a)
a.b.c++
a.d[0]++
a.d[1].e++
console.log(a, b, deepCopy(1))
