/**
 * @param {string} s
 * @param {number} k
 * @param {character} fill
 * @return {string[]}
 */
var divideString = function(s, k, fill) {
    let res = [];

    let i = 0;
    while (i < s.length) {
        res.push(s.slice(i, i = i + k));
    }

    const last = res[res.length - 1];
    if (last.length !== k) {
        res[res.length - 1] = last.padEnd(k, fill);
    }

    return res;
};
