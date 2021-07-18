/**
 * @param {number} n
 * @return {number[]}
 */
var sumZero = function(n) {
    // 简单 一正一负即可

    let res = n % 2 === 0 ? [] : [0]
    let len = Math.floor(n / 2)

    for (let i = 1; i <= len; i++) {
        res.push(i, -i)
    }

    return res
};
