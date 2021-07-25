/**
 * @param {number} n
 * @return {number[]}
 */
var getNoZeroIntegers = function(n) {
    for (let i = 1; i < n; i++) {
        let a = n - i

        if (!i.toString().includes('0') && !a.toString().includes('0')) {
            return [i, a]
        }
    }
};
