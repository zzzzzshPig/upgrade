/**
 * @param {number[]} nums
 * @return {boolean}
 */
var divideArray = function(nums) {
    let tong = [];

    for (let i = 0; i < nums.length; i++) {
        tong[nums[i]] = tong[nums[i]] + 1 || 1;
    }

    return tong.every(t => t % 2 === 0);
};
