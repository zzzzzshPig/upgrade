/**
 * @param {string} s
 * @return {string}
 */
var makeGood = function(s) {
    while (true) {
        let res = ''
        let i = 0

        for (; i < s.length - 1; i++) {
            if (s[i].charCodeAt(0) !== (s[i + 1].charCodeAt(0) ^ 32)) {
                res += s[i]
            } else {
                i++
            }
        }

        if (i === s.length - 1) {
            res += s[s.length - 1]
        }

        if (s === res) {
            return res
        }

        s = res
    }
};
console.log(makeGood('abBAcC'))
