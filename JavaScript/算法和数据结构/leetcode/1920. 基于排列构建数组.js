/**
 * @param {number[]} nums
 * @return {number[]}
 */
var buildArray = function(nums) {
    const arr = []

    nums.forEach((a, i) => {
        arr[i] = nums[a]
    })

    return arr
};
