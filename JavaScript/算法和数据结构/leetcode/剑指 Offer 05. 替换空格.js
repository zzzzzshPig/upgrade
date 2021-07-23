/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function(s) {
    let res = ''

    for (let a of s) {
        if (a === ' ') {
            res += '%20'
        } else {
            res += a
        }
    }

    return res
};
