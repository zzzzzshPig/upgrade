/**
 * @param {string} s
 * @return {boolean}
 */
var halvesAreAlike = function(s) {
    let yy = 'aeiouAEIOU'
    let len = s.length / 2
    let l = 0
    let r = 0

    for (let i = 0; i < len; i++) {
        if (yy.includes(s[i])) {
            l++
        }

        if (yy.includes(s[i + len])) {
            r++
        }
    }

    return l === r
};
