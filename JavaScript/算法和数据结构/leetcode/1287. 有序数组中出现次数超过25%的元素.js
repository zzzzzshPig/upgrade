/**
 * @param {number[]} arr
 * @return {number}
 */
var findSpecialInteger = function(arr) {
    let r = 0
    let l = arr.length / 4

    for (let i = 0; i < arr.length; i++) {
        r++

        if (arr[i] !== arr[i + 1]) {
            if (r > l) {
                return arr[i]
            }

            r = 0
        }
    }
};

console.log(findSpecialInteger([1,2,3,3]))
