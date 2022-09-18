/**
 * @param {number[][]} nums
 * @return {number[]}
 */
var intersection = function(nums) {
    const m = {};
    const res = [];

    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < nums[i].length; j++) {
            m[nums[i][j]] = m[nums[i][j]] + 1 || 1;

            if (m[nums[i][j]] === nums.length) {
                res.push(nums[i][j]);
            }
        }
    }

    return res.sort((a, b) => a - b);
};
