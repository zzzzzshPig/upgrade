/**
 * @param {string[]} words
 * @param {string} s
 * @return {number}
 */
var countPrefixes = function(words, s) {
    let res = 0;

    words.forEach(word => {
        if (word.length > s.length) return;

        let j = 0;
        while (j < word.length && word[j] === s[j]) {
            j++;
        }

        if (j === word.length) res++;
    })

    return res;
};
