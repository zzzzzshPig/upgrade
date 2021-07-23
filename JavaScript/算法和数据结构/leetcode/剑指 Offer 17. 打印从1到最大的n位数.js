/**
 * @param {number} n
 * @return {number[]}
 */
var printNumbers = function(n) {
    let res = []
    let len = Math.pow(10, n)

    for (let i = 1; i < len; i++) {
        res.push(i)
    }

    return res
};
