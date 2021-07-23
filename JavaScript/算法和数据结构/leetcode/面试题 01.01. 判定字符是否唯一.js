/**
 * @param {string} astr
 * @return {boolean}
 */
var isUnique = function(astr) {
    for (let i = 0; i < astr.length; i++) {
        for (let j = i + 1; j < astr.length; j++) {
            if (astr[i] === astr[j]) {
                return false
            }
        }
    }

    return true
};
