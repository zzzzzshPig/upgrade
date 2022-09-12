/**
 * @param {string[]} words1
 * @param {string[]} words2
 * @return {number}
 */
var countWords = function(words1, words2) {
    const m1 = {};
    words1.forEach(w => {
        m1[w] = m1[w] + 1 || 1;
    })
    const m2 = {};
    words2.forEach(w => {
        m2[w] = m2[w] + 1 || 1;
    })

    let res = 0;
    for (const key in m1) {
        if (m1[key] === 1 && m2[key] === 1) res++;
    }
    return res;
};
