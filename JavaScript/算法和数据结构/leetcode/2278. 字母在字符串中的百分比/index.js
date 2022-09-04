/**
 * @param {string} s
 * @param {character} letter
 * @return {number}
 */
var percentageLetter = function(s, letter) {
    let res = 0;

    for (let i = 0; i < s.length; i++) {
        if (s[i] === letter) {
            res++
        }
    }

    return Math.floor(res / s.length * 100)
};
