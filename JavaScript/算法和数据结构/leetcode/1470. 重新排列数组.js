/**
 * @param {number[]} nums
 * @param {number} n
 * @return {number[]}
 */
var shuffle = function(nums, n) {
    let res = []

    for (let i = 0; i < n; i++) {
        res.push(nums[i], nums[n + i])
    }

    return res
};
