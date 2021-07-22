/**
 * @param {number[]} nums
 * @param {number} target
 * @param {number} start
 * @return {number}
 */
var getMinDistance = function(nums, target, start) {
    let mi = Infinity

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            mi = Math.min(Math.abs(i - start), mi)

            if (mi === 0) break
        }
    }

    return mi
};
