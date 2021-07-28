/**
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
var countOdds = function(low, high) {
    let len = (high - low + 1) / 2

    return low % 2 === 0 ? Math.floor(len) : Math.ceil(len)
};
