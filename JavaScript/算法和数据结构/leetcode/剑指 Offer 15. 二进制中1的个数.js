/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function(n) {
    n = n.toString(2)

    let res = 0

    for (let i = 0; i < n.length; i++) {
        if (n[i] === '1') {
            res++
        }
    }

    return res
};
