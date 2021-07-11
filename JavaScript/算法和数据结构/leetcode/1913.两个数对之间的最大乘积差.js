/**
 * @param {number[]} nums
 * @return {number}
 */
// 找到两个最大值和两个最小值即可
var maxProductDifference = function(nums) {
    let max1 = -1
    let max2 = 0
    let min1 = 99999
    let min2 = 99998

    nums.forEach(a => {
        if (a > max1) {
            [max1, max2] = [a, max1]
        } else if (a > max2) {
            max2 = a
        }

        if (a < min1) {
            [min1, min2] = [a, min1]
        } else if (a < min2) {
            min2 = a
        }
    })

    return max1 * max2 - min1 * min2
};

console.log(maxProductDifference([1,2,3,4554,7645,6435,252,3414,432,42,35,25]))
