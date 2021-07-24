/**
 * @param {number[]} target
 * @param {number} n
 * @return {string[]}
 */
var buildArray = function(target, n) {
    let res = []
    let j = 0

    for (let i = 1; i <= n && j < target.length; i++) {
        if (target[j] !== i) {
            res.push('Push', 'Pop')
        } else {
            j++
            res.push('Push')
        }
    }

    return res
};
