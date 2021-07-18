/**
 * @param {number} n
 * @return {string}
 */
var generateTheString = function(n) {
    return n % 2 === 0 ? ''.padStart(n - 1, 'a') + 'b' : ''.padStart(n, 'a')
};
