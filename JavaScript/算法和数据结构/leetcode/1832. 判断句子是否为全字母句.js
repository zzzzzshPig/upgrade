/**
 * @param {string} sentence
 * @return {boolean}
 */
//
var checkIfPangram = function(sentence) {
    const set = new Set()

    for (const s of sentence) {
        set.add(s)
    }

    return set.size === 26
};

console.log(checkIfPangram('thequickbrownfoxjumpsoverthelazydog'))
