/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var kLengthApart = function(nums, k) {
    let idx = nums.indexOf(1)

    for (let i = idx + 1; i < nums.length; i++) {
        if (nums[i] === 1) {
            if (k >= i - idx) {
                return false
            }

            idx = i
        }
    }

    return true
};
