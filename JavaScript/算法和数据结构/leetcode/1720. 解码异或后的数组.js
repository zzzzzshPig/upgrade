/**
 * @param {number[]} encoded
 * @param {number} first
 * @return {number[]}
 */
var decode = function(encoded, first) {
    let res = [first]

    for (let a of encoded) {
        first ^= a
        res.push(first)
    }

    return res
};
