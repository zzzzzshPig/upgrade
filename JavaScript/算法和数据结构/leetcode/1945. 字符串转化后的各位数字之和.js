/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var getLucky = function(s, k) {
    let res = ''

    for (let i = 0; i < s.length; i++) {
        res += s[i].charCodeAt(0) - 96
    }

    while (k > 0) {
        let s = 0
        const r = res.toString()

        for (let i = 0; i < r.length; i++) {
            s += Number(r[i])
        }

        res = s
        k--
    }

    return res
};
console.log(getLucky('leetcode', 9))
