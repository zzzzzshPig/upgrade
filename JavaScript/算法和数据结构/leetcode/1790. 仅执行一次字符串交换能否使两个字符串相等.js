/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var areAlmostEqual = function(s1, s2) {
    let r = []

    for (let i = 0; i < s1.length; i++) {
        if (s1[i] !== s2[i]) {
            r.push(i)
        }

        if (r.length > 2) {
            return false
        }
    }

    return s1[r[0]] === s2[r[1]] && s1[r[1]] === s2[r[0]]
};
