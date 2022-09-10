/**
 * @param {string} word
 * @param {character} ch
 * @return {string}
 */
var reversePrefix = function(word, ch) {
    let s = '';

    for (let i = 0; i < word.length; i++) {
        if (!ch) {
            s += word[i];
        }
        else {
            s = word[i] + s;
            if (word[i] === ch) {
                ch = false;
            }
        }
    }

    return ch ? word : s;
};
