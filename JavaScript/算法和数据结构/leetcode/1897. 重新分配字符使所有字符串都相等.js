/**
 * @param {string[]} words
 * @return {boolean}
 */
var makeEqual = function(words) {
    let hash = {}

    words.forEach(a => {
        for (let i = 0; i < a.length; i++) {
            hash[a[i]] = hash[a[i]] + 1 || 1
        }
    })

    for (const hashKey in hash) {
        if (hash[hashKey] % words.length !== 0) {
            return false
        }
    }

    return true
};
