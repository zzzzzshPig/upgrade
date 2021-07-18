/**
 * @param {number[]} nums
 * @return {number}
 */
var sumOfUnique = function(nums) {
    const rule = {}

    nums.forEach(a => {
        rule[a] = (rule[a] + 1) || 1
    })

    let res = 0

    for (let k in rule) {
        if (rule[k] === 1) {
            res -= -k
        }
    }

    return res
};
