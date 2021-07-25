/**
 * @param {string} s
 * @return {number}
 */
var countBinarySubstrings = function(s) {
    let count = 0
    let flag = s[0]
    let res = 0

    for (let i = 0; i < s.length; i++) {
        if (s[i] !== flag) {
            let len = Math.min(i + count, s.length)

            for (let j = i; j < len; j++) {
                if (s[j] !== flag) {
                    res++
                } else {
                    break
                }
            }

            flag = s[i]
            count = 1
        } else {
            count++
        }
    }

    return res
};

console.log(countBinarySubstrings("00110"))
