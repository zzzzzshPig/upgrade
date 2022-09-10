/**
 * @param {string[]} patterns
 * @param {string} word
 * @return {number}
 */
var numOfStrings = function(patterns, word) {
    let res = 0;

    patterns.forEach(pattern => {
        if (word.includes(pattern)) res++
    })

    return res;
};
