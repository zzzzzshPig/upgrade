/**
 * @param {number[]} nums
 * @return {number[]}
 */
var minSubsequence = function(nums) {
    let sum = nums.reduce((a, b) => a + b, 0)
    let s = 0
    let res = []

    while (sum >= s) {
        let max = 0

        for (let i = 1; i < nums.length; i++) {
            if (nums[i] > nums[max]) {
                max = i
            }
        }

        s += nums[max]
        sum -= nums[max]
        res.push(nums[max])

        nums[max] = 0
    }

    return res
};
