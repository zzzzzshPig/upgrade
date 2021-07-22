/**
 * @param {number[]} nums
 * @return {number}
 */
var maxAscendingSum = function(nums) {
    let res = 0

    let r = nums[0]

    for (let i = 1; i <= nums.length; i++) {
        if (nums[i] > nums[i - 1]) {
            r += nums[i]
        } else {
            res = Math.max(r, res)
            r = nums[i]
        }
    }

    return res
};
