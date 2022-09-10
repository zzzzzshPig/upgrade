/**
 * @param {number[]} nums
 * @param {number} original
 * @return {number}
 */
var findFinalValue = function(nums, original) {
    let tong = [];

    nums.forEach(num => {
        tong[num] = num;
    })

    while (tong[original]) {
        original *= 2;
    }

    return original;
};
