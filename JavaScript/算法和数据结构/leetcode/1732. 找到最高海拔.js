/**
 * @param {number[]} gain
 * @return {number}
 */
var largestAltitude = function(gain) {
    let res = 0,
        r = 0

    gain.forEach((a, i) => {
        r += a

        if (r > res) res = r
    })

    return res
};
