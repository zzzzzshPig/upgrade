/**
 * @param {number[]} nums
 * @return {number[]}
 */
var buildArray = function(nums) {
    const ans = [];

    for (let i = 0; i < nums.length; i++) {
        ans.push(nums[nums[i]]);
    }

    return ans;
};

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var buildArray2 = function(nums) {
    for (let i = 0; i < nums.length; i++) {
        nums[i] += (nums[nums[i]] % 1000) * 1000;
    }

    for (let i = 0; i < nums.length; i++) {
        nums[i] = parseInt(nums[i] / 1000);
    }

    return nums;
};

