/**
 * @param {string} sentence
 * @param {string} searchWord
 * @return {number}
 */
var isPrefixOfWord = function(sentence, searchWord) {
    sentence = ' ' + sentence

    let idx = 0

    for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] === ' ') {
            idx++
            
            if (sentence.slice(i + 1, i + 1 + searchWord.length) === searchWord) {
                return idx
            }
        }
    }

    return -1
};
