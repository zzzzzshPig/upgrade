/**
 * @param {number[]} code
 * @param {number} k
 * @return {number[]}
 */
var decrypt = function(code, k) {
    // 滑动窗口
    let a = k > 0 ? 1 : -1
    let res = []
    k = Math.abs(k)

    for (let i = 0; i < code.length; i++) {
        let sum = 0
        let s = i + (1 * a)

        for (let j = 0; j < k; j++) {
            s = s >= code.length ? 0 : s < 0 ? code.length - 1 : s

            sum += code[s]

            s += a
        }

        res.push(sum)
    }

    return res
};
console.log(decrypt([5, 7, 1, 4], 3))
