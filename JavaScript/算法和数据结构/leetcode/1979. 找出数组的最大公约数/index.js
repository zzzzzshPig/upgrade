/**
 * @param {number[]} nums
 * @return {number}
 */
var findGCD = function(nums) {
    let min = Infinity;
    let max = -Infinity;

    nums.forEach(num => {
        if (num < min) min = num
        if (num > max) max = num
    })

    while (max % min !== 0) {
        [max, min] = [min, max % min]
    }

    return min;
};
