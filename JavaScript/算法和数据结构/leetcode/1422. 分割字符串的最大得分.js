/**
 * @param {string} s
 * @return {number}
 */
var maxScore = function(s) {
    let totalZero = 0

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '0') {
            totalZero++
        }
    }

    let zero = 0
    let res = 0
    let len = s.length - 1
    let idx = 0

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '0') {
            zero++
        }

        let val = zero * 2 + len - i - totalZero + (s[i] === '0' ? 0 : 1)
        if (val >= res) {
            if (val === res && i === len) break

            res = val
            idx = i
        }
    }

    return res + (idx === 0 || idx === len ? -1 : 0)
};
console.log(maxScore("00"))
