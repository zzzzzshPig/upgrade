/**
 * @param {number[]} nums
 * @return {number}
 */
var minimumOperations = function(nums) {
    let map = {}
    let res = 0;

    nums.forEach(num => {
        if (map[num] || num === 0) return

        map[num] = 1;
        res++;
    })

    return res;
};
