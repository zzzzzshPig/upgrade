/**
 * @param {string} s
 * @return {string}
 */
var longestNiceSubstring = function(s) {
    let res = ''

    for (let i = 0; i < s.length; i++) {
        let r = s[i]

        for (let j = i + 1; j < s.length; j++) {
            r += s[j]

            if (isB(r) && r.length > res.length) {
                res = r
            }
        }
    }

    return res
};

function isB (str) {
    for (let i = 0; i < str.length; i++) {
        if (!str.includes(str[i].toLowerCase()) || !str.includes(str[i].toUpperCase())) {
            return false
        }
    }

    return true
}

console.log(longestNiceSubstring("BebjJE"))
