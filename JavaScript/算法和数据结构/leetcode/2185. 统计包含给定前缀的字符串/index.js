/**
 * @param {string[]} words
 * @param {string} pref
 * @return {number}
 */
var prefixCount = function(words, pref) {
    let res = 0;

    words.forEach(word => {
        if (word.startsWith(pref)) res++
    })

    return res;
};
