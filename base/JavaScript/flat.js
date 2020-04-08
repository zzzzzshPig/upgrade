/**
 * 数组扁平化
 * @param  {Array} array  需要扁平的数组
 * @param  {Number} level  扁平层数
 */
function flat (array, level = 1) {
    let res = []

    for (let a of array) {
        if (Array.isArray(a) && level > 0) {
            res.push(...flat(a, level - 1))
        } else {
            res.push(a)
        }
    }

    return res
}

let testa = [1,2,3,[4,5,[1,2,3]]]
console.log(flat(testa, 0)[3][0] = 2)
console.log(testa)
console.log(testa.flat(0))
console.log(testa)

