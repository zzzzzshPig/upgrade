/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var sumBase = function(n, k) {
    const str = n.toString(k)
    let res = 0

    for (const s of str) {
        res += Number(s)
    }

    return res
};
console.log(sumBase(10, 10))
