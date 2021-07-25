/**
 * @param {string} s
 * @return {number}
 */
var minOperations = function(s) {
    let a = 0
    let b = 0

    for (let i = 0; i < s.length; i++) {
        let isZero = s[i] === '0'
        let isT = i % 2 === 0

        if ((isZero && !isT) || (!isZero && isT)) {
            a++
        } else {
            b++
        }
    }

    return Math.min(a, b)
};
