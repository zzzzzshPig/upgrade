/**
 * @param {number[]} nums
 * @param {number} diff
 * @return {number}
 */
var arithmeticTriplets = function(nums, diff) {
    let map = {};

    for (let i = 0; i < nums.length; i++) {
        map[nums[i]] = true;
    }

    let res = 0 ;

    for (let i = 0; i < nums.length; i++) {
        const a = nums[i] + diff;

        if (map[a] && map[a + diff]) res++;
    }

    return res;
};
