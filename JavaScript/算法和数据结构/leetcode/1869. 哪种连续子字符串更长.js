/**
 * @param {string} s
 * @return {boolean}
 */
// 重点在于 i <= s.length 最后一次执行时必然是不相等，所以会对最后一个长串进行处理
var checkZeroOnes = function(s) {
    let one = 0
    let zero = 0
    let str = ''

    for (let i = 0; i <= s.length; i++) {
        let a = s[i]

        if (str[0] === a) {
            str += a
        } else {
            if (str[0] === '1') {
                one = Math.max(one, str.length)
            } else {
                zero = Math.max(zero, str.length)
            }

            str = a
        }
    }

    return one > zero
};
console.log(checkZeroOnes('1101'))
