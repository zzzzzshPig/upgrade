/**
 * @param {number[]} nums
 * @return {number}
 */
var minPairSum = function(nums) {
    nums.sort((a, b) => a - b);

    let res = 0;
    let length = nums.length / 2;
    let n = nums.length - 1;

    for (let i = 0; i < length; i++) {
        res = Math.max(res, nums[i] + nums[n - i]);
    }

    return res;
};
