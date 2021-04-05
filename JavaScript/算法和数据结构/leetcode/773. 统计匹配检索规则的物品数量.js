/**
 * @param {string[][]} items
 * @param {string} ruleKey
 * @param {string} ruleValue
 * @return {number}
 */
var countMatches = function(items, ruleKey, ruleValue) {
    let res = 0
    const idx = ['type', 'color', 'name'].indexOf(ruleKey)

    for (let a of items) {
        if (a[idx] === ruleValue) res++
    }

    return res
};
