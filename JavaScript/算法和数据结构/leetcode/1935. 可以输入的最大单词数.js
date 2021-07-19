/**
 * @param {string} text
 * @param {string} brokenLetters
 * @return {number}
 */
var canBeTypedWords = function(text, brokenLetters) {
    text += ' '
    let res = 0
    let gate = false

    for (let i = 0; i < text.length; i++) {
        if (brokenLetters.includes(text[i])) {
            gate = true
        } else if (text[i] === ' ') {
            if (!gate) res++
            gate = false
        }
    }

    return res
};
