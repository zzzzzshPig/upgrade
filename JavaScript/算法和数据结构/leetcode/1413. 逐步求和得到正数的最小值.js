/**
 * @param {number[]} nums
 * @return {number}
 */
var minStartValue = function(nums) {
    // 获取累加的最小值
    // 正数返回1，负数返回-min + 1

    let min = 0
    let r = 0

    for (let i = 0; i < nums.length; i++) {
        r += nums[i]

        min = Math.min(min, r)
    }

    return min < 0 ? -min + 1 : 1
};
