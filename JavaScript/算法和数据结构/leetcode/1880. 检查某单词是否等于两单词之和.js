/**
 * @param {string} firstWord
 * @param {string} secondWord
 * @param {string} targetWord
 * @return {boolean}
 */
var isSumEqual = function(firstWord, secondWord, targetWord) {
    let len = Math.max(firstWord.length, secondWord.length, targetWord.length)
    let f = ''
    let s = ''
    let t = ''

    for (let i = 0; i < len; i++) {
        f += firstWord.length > i ? firstWord[i].charCodeAt(0) - 97 : ''
        s += secondWord.length > i ? secondWord[i].charCodeAt(0) - 97 : ''
        t += targetWord.length > i ? targetWord[i].charCodeAt(0) - 97 : ''
    }

    return Number(f) + Number(s) === Number(t)
};
