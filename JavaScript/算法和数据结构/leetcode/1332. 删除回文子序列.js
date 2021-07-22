/**
 * @param {string} s
 * @return {number}
 */
var removePalindromeSub = function(s) {
    // 要注意是删除回文子序列
    if (s.length === 0) return 0

    let l = 0
    let r = s.length - 1

    while (l < r) {
        if (s[l] !== s[r]) {
            return 2
        }

        l++
        r--
    }

    return 1
};
