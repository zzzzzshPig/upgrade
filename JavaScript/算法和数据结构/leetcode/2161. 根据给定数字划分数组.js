/**
 * https://leetcode-cn.com/problems/partition-array-according-to-given-pivot/
 * @param {number[]} nums
 * @param {number} pivot
 * @return {number[]}
 */
var pivotArray = function(nums, pivot) {
    let min = [];
    let mid = [];
    let max = [];

    nums.forEach(num => {
        if (num < pivot) {
            min.push(num);
        } else if (num === pivot) {
            mid.push(num);
        } else {
            max.push(num);
        }
    })

    return [...min, ...mid, ...max];
};
