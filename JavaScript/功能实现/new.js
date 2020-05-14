function new1 (obj, ...arg) {
    if (typeof obj !== 'function') return obj

    const res = Object.create(obj.prototype)
    obj.apply(res, arg)

    return res
}

function S (name) {
    this.name = name
}
S.prototype = {
    constructor: S,
    hh: 'hh'
}

const n = new1(S, '1111')
console.log(Object.getPrototypeOf(n) === Object.getPrototypeOf(new S('1111')))
