/**
 * @param {number[]} arr
 * @return {boolean}
 */
var canMakeArithmeticProgression = function(arr) {
    // 排序即可
    arr.sort((a, b) => a - b)

    let d = arr[1] - arr[0]

    for (let i = 2; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] !== d) {
            return false
        }
    }

    return true
};

console.log(canMakeArithmeticProgression([3, 5, 1]));
