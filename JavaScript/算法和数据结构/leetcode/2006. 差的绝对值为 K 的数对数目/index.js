/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var countKDifference = function(nums, k) {
    let map = {};

    for (let i = 0; i < nums.length; i++) {
        map[nums[i]] = (map[nums[i]] + 1) || 1;
    }

    let res = 0;

    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(k + nums[i]);
        if (map[index]) res += map[index];
    }

    return res;
};
