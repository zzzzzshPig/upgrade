/**
 * @param {string} s
 * @return {string}
 */
var sortSentence = function(s) {
    s += ' '
    let str = ''
    const res = []

    for (let i = 0; i < s.length; i++) {
        if (s[i] !== ' ') {
            str += s[i]
        } else {
            res[s[i - 1] - 1] = str.slice(0, -1)
            str = ''
        }
    }

    return res.join(' ')
};
