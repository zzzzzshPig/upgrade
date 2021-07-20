/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
var countPrimeSetBits = function(left, right) {
    // 最大只有19个1
    let res = 0
    const zs = [2, 3, 5, 7, 11, 13, 17, 19]

    for(; left <= right; left++) {
        if (zs.includes(format(left))) {
            res++
        }
    }

    return res
};

function format (num) {
    const str = num.toString(2)
    let res = 0

    for (let a of str) {
        if (a === '1') {
            res++
        }
    }

    return res
}
