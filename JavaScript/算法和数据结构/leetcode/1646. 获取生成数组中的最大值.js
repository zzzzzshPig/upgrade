/**
 * @param {number} n
 * @return {number}
 */
var getMaximumGenerated = function(n) {
    const nums = [0, 1]
    let res = 0

    if (nums[n]) return nums[n]

    for (let i = 1; i < n; i++) {
        if (2 * i <= n) {
            nums[2 * i] = nums[i]
        }

        if (2 * i + 1 <= n) {
            nums[2 * i + 1] = nums[i] + nums[i + 1]
        }

        res = Math.max(res, nums[2 * i] || 0, nums[2 * i + 1] || 0)
    }

    return res
};
getMaximumGenerated(7)
