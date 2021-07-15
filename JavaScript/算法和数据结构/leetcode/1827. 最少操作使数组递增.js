/**
 * @param {number[]} nums
 * @return {number}
 */
// 最小递增数组
var minOperations = function(nums) {
    let res = 0

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] <= nums[i - 1]) {
            res += nums[i - 1] - nums[i] + 1
            nums[i] = nums[i - 1] + 1
        }
    }

    return res
};
console.log(minOperations([1,1,1]))
