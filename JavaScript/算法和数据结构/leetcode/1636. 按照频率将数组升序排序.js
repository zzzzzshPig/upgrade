/**
 * @param {number[]} nums
 * @return {number[]}
 */
var frequencySort = function(nums) {
    const rule = {}

    nums.forEach(a => {
        if (!rule[a]) {
            rule[a] = {
                c: 1,
                v: a
            }
        } else {
            rule[a].c++
        }
    })

    const arr = Object.values(rule)

    arr.sort((a, b) => {
        if (a.c === b.c) {
            return b.v - a.v
        } else {
            return a.c - b.c
        }
    })

    const res = []

    arr.forEach(a => {
        res.push(...Array.from({ length: a.c }).fill(a.v))
    })

    return res
};
console.log(frequencySort([1,1,2,2,2,3]));
