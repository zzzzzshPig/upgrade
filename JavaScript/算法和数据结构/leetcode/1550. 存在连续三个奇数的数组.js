/**
 * @param {number[]} arr
 * @return {boolean}
 */
var threeConsecutiveOdds = function(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 1) {
            let j = i + 1

            for (; j < i + 3; j++) {
                if (arr[j] % 2 !== 1) {
                    break
                }
            }

            if (j === i + 3) return true
        }
    }

    return false
};
