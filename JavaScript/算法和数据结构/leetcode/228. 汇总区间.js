/**
 * @param {number[]} nums
 * @return {string[]}
 */
var summaryRanges = function(nums) {
    let res = []
    let r = []

    for (let i = 0; i < nums.length; i++) {
        if (r.length === 2) {
            r[1] = nums[i]
        } else {
            r.push(nums[i])
        }

        if (nums[i] !== nums[i + 1] - 1) {
            res.push(r.join('->'))
            r = []
        }
    }

    return res
};
