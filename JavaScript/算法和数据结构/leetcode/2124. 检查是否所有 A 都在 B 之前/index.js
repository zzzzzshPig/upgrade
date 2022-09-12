/**
 * @param {string} s
 * @return {boolean}
 */
var checkString = function(s) {
    let hasB = false;

    for (let i = 0; i < s.length; i++) {
        if (hasB && s[i] === 'a') return false;
        if (s[i] === 'b') hasB = true;
    }

    return true;
};
