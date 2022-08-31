/**
 * @param {string[]} sentences
 * @return {number}
 */
var mostWordsFound = function(sentences) {
    let x = 0;

    for (let i = 0; i < sentences.length; i++) {
        let y = 0;

        for (let j = 0; j < sentences[i].length; j++) {
            if (sentences[i][j] === ' ') y++;
        }

        if (y > x) x = y;
    }

    return x + 1;
};
