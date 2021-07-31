/**
 * @param {string} s
 * @return {string}
 */
var reformat = function(s) {
    let nstr = ''
    let str = ''

    for (let i = 0; i < s.length; i++) {
        if (s[i] >= 'a') {
            str += s[i]
        } else {
            nstr += s[i]
        }
    }

    if (str.length > nstr.length) {
        [nstr, str] = [str, nstr]
    }

    if (str.length !== nstr.length && nstr.length - str.length !== 1) {
        return ''
    }

    let res = ''

    for (let i = 0; i < nstr.length; i++) {
        res += nstr[i] + (str[i] || '')
    }

    return res
};
