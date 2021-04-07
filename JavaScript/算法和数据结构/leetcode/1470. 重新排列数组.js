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

// 原数组上操作的解法
var shuffle1 = function(nums, n) {
    const y = n
    let x = []

    for (let i = 1; i < nums.length - 1; i++) {
        if (i < y) x.push(nums[i])

        if (i % 2 === 1) {
            nums[i] = nums[n]
        } else {
            nums[i] = x.shift()
            n++
        }
    }
    return nums
};
