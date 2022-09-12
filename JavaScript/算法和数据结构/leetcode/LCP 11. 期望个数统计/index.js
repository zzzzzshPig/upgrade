/**
 * @param {number[]} scores
 * @return {number}
 */
var expectNumber = function(scores) {
    const set = new Set();
    scores.forEach(score => {
        set.add(score);
    })
    return set.size;
};
