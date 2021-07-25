/**
 * @param {string} s
 * @return {number}
 */
var maxLengthBetweenEqualCharacters = function(s) {
    let res = 0
    let r = {}

    for (let i = 0; i < s.length; i++) {
        if (r[s[i]] !== undefined) {
            res = Math.max(i - r[s[i]], res)
        } else {
            r[s[i]] = i
        }
    }

    return res - 1
};
