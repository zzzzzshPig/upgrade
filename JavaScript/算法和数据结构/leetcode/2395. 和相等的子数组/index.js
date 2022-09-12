/**
 * @param {number[]} nums
 * @return {boolean}
 */
var findSubarrays = function(nums) {
    const m = {};

    for (let i = 0; i < nums.length; i++) {
        const add = nums[i] + nums[i + 1];
        if (m[add]) return true;
        m[add] = true;
    }

    return false;
};
