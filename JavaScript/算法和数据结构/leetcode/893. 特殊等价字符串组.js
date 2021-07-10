/**
 * @param {string[]} words
 * @return {number}
 */
// 统计每个word的 奇数位和偶数位 的字符出现的次数
var numSpecialEquivGroups = function(words) {
    const set = new Set()

    words.forEach(a => {
        const arr = Array.from({ length: 52 }).fill(0)

        for (let i = 0; i < a.length; i++) {
            const inx = 26 * (i % 2) + a[i].charCodeAt(0) - 97
            arr[inx]++
        }

        set.add(arr.join(''))
    })

    return set.size
};
console.log(numSpecialEquivGroups(["abcd","cdab","cbad","xyzz","zzxy","zzyx"]))
