/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */
var reverseBits = function(n) {
    // 补前置0
    const _n = n.toString(2).padStart(32, '0');
    return parseInt(_n.split('').reverse().join(''), 2);
};
