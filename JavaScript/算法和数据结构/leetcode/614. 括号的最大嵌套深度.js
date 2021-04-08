/**
 * @param {string} s
 * @return {number}
 */
var maxDepth = function(s) {
    let r = 0
    let res = 0

    for (let a of s) {
        if (a === '(') {
            r++

            if (r > res) {
                res = r
            }
        } else if (a === ')') {
            r--
        }
    }

    return res
};
