/**
 * @param {string} allowed
 * @param {string[]} words
 * @return {number}
 */
var countConsistentStrings = function(allowed, words) {
    let res = 0

    words.forEach(a => {
        for (let aa of a) {
            if (!allowed.includes(aa)) return
        }

        res++
    })

    return res
};
