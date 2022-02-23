/**
 * @param {number} n
 * @param {number[]} startPos
 * @param {string} s
 * @return {number[]}
 */

var executeInstructions = function(n, startPos, s) {
    const answers = [];

    for (let i = 0; i < s.length; i++) {
        let x = startPos[0];
        let y = startPos[1];

        let j = i;
        for (j; j < s.length; j++) {
            if (s[j] === 'L') {
                y--
            } else if (s[j] === 'R') {
                y++
            } else if (s[j] === 'U') {
                x--
            } else {
                x++
            }

            if (y < 0 || y >= n || x < 0 || x >= n) {
                break;
            }
        }

        answers.push(j - i);
    }

    return answers;
};
