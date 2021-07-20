/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @param {number} d
 * @return {number}
 */
var findTheDistanceValue = function(arr1, arr2, d) {
    let res = 0

    arr1.forEach(a => {
        for (let i = 0; i < arr2.length; i++) {
            if (Math.abs(a - arr2[i]) <= d) {
                return
            }
        }

        res++
    })

    return res
};
