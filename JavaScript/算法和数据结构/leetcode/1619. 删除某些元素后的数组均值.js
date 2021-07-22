/**
 * @param {number[]} arr
 * @return {number}
 */
var trimMean = function(arr) {
    arr.sort((a, b) => a - b)

    let min = arr.length * 0.05
    let max = arr.length - min
    let count = max - min
    let res = 0

    for (; min < max; min++) {
        res += arr[min]
    }

    return res / count
};
