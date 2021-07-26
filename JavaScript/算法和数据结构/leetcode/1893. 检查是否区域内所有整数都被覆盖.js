/**
 * @param {number[][]} ranges
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
var isCovered = function(ranges, left, right) {
    let rule = Array.from({length: 51}).fill(0)

    ranges.forEach(a => {
        for (let i = a[0]; i <= a[1]; i++) {
            rule[i]++
        }
    })

    for (let i = 0; i < rule.length; i++) {
        if (i >= left && rule[i] === 0 && i <= right) {
            return false
        }
    }

    return true
};
console.log(isCovered([[1,2],[3,4],[5,6]],2,5))
