/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    // 获得最大的两个数即可
    let m1 = 0
    let m2 = 0

    nums.forEach(a => {
        if (a > m1) {
            [m1, m2] = [a, m1]
        } else if (a > m2) {
            m2 = a
        }
    })

    return (m1 - 1) * (m2 - 1)
};
