/**
 * @param {string} s
 * @return {number}
 */
var maxPower = function(s) {
    let res = 1
    let count = 0

    for (let i = 0; i < s.length; i++) {
        count++

        if (s[i] !== s[i + 1]) {
            res = Math.max(res, count)
            count = 0
        }
    }

    return res
};
