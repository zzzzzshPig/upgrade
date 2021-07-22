/**
 * @param {number[]} arr
 * @return {number[][]}
 */
var minimumAbsDifference = function(arr) {
    arr.sort((a, b) => a - b)

    let min = Infinity
    // 找最小差
    for (let i = 0; i < arr.length - 1; i++) {
        min = Math.min(min, arr[i + 1] - arr[i])

        if (min === 1) break
    }

    const res = []
    for (let i = 0; i < arr.length - 1; i++) {
        if (res[i + 1] - res[i] === min) {
            res.push([arr[i], arr[i + 1]])
        }
    }

    return res
};
