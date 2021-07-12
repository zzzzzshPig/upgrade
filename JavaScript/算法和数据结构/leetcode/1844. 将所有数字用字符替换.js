/**
 * @param {string} s
 * @return {string}
 */
var replaceDigits = function(s) {
    let res = s[0]

    for (let i = 1; i < s.length; i++) {
        if (i % 2 !== 0) {
            res += String.fromCharCode(res[res.length - 1].charCodeAt(0) + Number(s[i]))
        } else {
            res += s[i]
        }
    }

    return res
};
console.log(replaceDigits('a'))
