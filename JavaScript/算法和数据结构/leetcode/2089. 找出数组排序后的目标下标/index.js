/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var targetIndices = function(nums, target) {
    let s = 0;
    let m = 0;

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < target) s++;
        else if (nums[i] === target) m++;
    }

    let res = [];
    for (let i = 0; i < m; i++) {
        res.push(s + i);
    }

    return res;
};
