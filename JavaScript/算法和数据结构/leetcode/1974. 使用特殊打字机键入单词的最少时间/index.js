/**
 * @param {string} word
 * @return {number}
 */
var minTimeToType = function(word) {
    let res = 0;

    for (let i = 0; i < word.length; i++) {
        const count = Math.abs((word[i - 1] || 'a').charCodeAt(0) - word.charCodeAt(i));
        res += 1 + Math.min(26 - count, count);
    }

    return res;
};
