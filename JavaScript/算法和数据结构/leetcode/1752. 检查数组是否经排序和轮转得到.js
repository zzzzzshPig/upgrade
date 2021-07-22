/**
 * @param {number[]} nums
 * @return {boolean}
 */
var check = function(nums) {
    let gate = false

    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] <= nums[i + 1]) continue

        if (gate) return false
        gate = true
    }

    if (gate) {
        return nums[nums.length  -1] <= nums[0]
    } else {
        return true
    }
};
