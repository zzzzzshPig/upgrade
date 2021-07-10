/**
 * @param {number[]} nums
 * @return {number}
 */
var findNumbers = function(nums) {
    return nums.filter(a => a.toString().length % 2 === 0).length
};
