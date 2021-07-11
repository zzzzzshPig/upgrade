/**
 * @param {number[]} nums
 * @return {number}
 */
var arraySign = function(nums) {
    const sum = nums.reduce((a, b) => a * b)

    return sum > 0 ? 1 : sum < 0 ? -1 : 0
};
