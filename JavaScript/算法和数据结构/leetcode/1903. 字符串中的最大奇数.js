/**
 * @param {string} num
 * @return {string}
 */
var largestOddNumber = function(num) {
    let res = -1

    for (let i = num.length - 1; i >= 0; i--) {
        if (num[i] % 2 === 1) {
            res = i
            break
        }
    }

    return res === -1 ? '' : num.slice(0, res + 1)
};
