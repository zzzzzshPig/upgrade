/**
 * @param {string} s
 * @return {string}
 */
var freqAlphabets = function(s) {
    // 因为s 是映射始终存在的有效字符串
    // 所以不存在 01# 这种情况，也就是说只要遇到#就可以i-=2然后替换即可
    let res = ''

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] !== '#') {
            res = String.fromCharCode(Number(s[i]) + 96) + res
        } else {
            res = String.fromCharCode(Number(s[i - 2] + s[i - 1]) + 96) + res
            i -= 2
        }
    }

    return res
};
console.log(freqAlphabets('12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#'))
