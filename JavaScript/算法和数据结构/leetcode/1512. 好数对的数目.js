/**
 * @param {number[]} nums
 * @return {number}
 */
var numIdenticalPairs = function(nums) {
    const map = {}
    let res = 0

    nums.forEach(a => {
        if (map[a]) res += map[a]

        map[a] = map[a] + 1 || 1
    })

    return res
};
