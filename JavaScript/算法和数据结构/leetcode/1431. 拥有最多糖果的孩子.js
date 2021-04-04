/**
 * @param {number[]} candies
 * @param {number} extraCandies
 * @return {boolean[]}
 */
var kidsWithCandies = function(candies, extraCandies) {
    // 求得最大值
    let max = 0

    for (let a of candies) {
        if (a > max) max = a
    }

    const res = []
    for (let a of candies) {
        res.push(a + extraCandies >= max)
    }
    return res
};
