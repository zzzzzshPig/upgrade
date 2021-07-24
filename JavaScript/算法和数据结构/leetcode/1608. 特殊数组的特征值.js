/**
 * @param {number[]} nums
 * @return {number}
 */
var specialArray = function(nums) {
    let l = 1
    let r = 100

    while (l < r) {
        let m = l + Math.floor((r - l) / 2)
        let x = 0

        for (let i = 0; i < nums.length; i++) {
            if (nums[i] >= m) {
                x++
            }
        }

        if (x === m) {
            return x
        } else if (x < m) {
            r = m - 1
        } else {
            l = m + 1
        }
    }

    return -1
};
console.log(specialArray([3,6,7,7,0]))
