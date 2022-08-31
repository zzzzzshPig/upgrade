/**
 * @param {string} s
 * @return {number}
 */
var countAsterisks = function(s) {
    let res = 0;
    let inBlock = false;

    for (let i = 0; i < s.length; i++) {
        if (!inBlock && s[i] === '*') {
            res++;
        }

        if (s[i] === '|') {
            inBlock = !inBlock;
        }
    }

    return res;
};
