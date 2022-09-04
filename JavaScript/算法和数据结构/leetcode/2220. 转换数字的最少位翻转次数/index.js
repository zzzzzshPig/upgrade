/**
 * @param {number} start
 * @param {number} goal
 * @return {number}
 */
var minBitFlips = function(start, goal) {
    let res = 0;
    let s = (start ^ goal).toString(2);

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '1') res++;
    }

    return res;
};
