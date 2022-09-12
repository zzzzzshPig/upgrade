/**
 * @param {number[]} nums
 * @return {number}
 */
var minMaxGame = function(nums) {
    let sqrt = nums.length

    while (sqrt !== 1) {
        sqrt /= 2;

        let j = 0;
        for (let i = 0; i < sqrt; i++) {
            if (i % 2 === 0) nums[i] = Math.min(nums[j], nums[j + 1])
            else nums[i] = Math.max(nums[j], nums[j + 1])
            j += 2;
        }
    }

    return nums[0];
};
