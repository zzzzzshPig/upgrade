/**
 * @param {string[]} words
 * @return {string}
 */
var firstPalindrome = function(words) {
    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        let l = 0;
        let r = word.length - 1;

        while (l < r) {
            if (word[l] !== word[r]) break;

            l++;
            r--;
        }

        if (l >= r) return word;
    }

    return '';
};
