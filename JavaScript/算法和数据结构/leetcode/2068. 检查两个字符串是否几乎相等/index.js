/**
 * @param {string} word1
 * @param {string} word2
 * @return {boolean}
 */
var checkAlmostEquivalent = function(word1, word2) {
    const m = {};

    for (let i = 0; i < word1.length; i++) {
        m[word1[i]] = m[word1[i]] === undefined ? 1 : m[word1[i]] + 1;
        m[word2[i]] = m[word2[i]] === undefined ? -1 : m[word2[i]] - 1;
    }

    for (const mKey in m) {
        if (m[mKey] > 3 || m[mKey] < -3) return false;
    }

    return true;
};
