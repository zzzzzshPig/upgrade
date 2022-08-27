/**
 * @param {string} s
 * @return {string[]}
 */
var cellsInRange = function(s) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let c1 = chars.indexOf(s[0]);
    let c2 = chars.indexOf(s[3]);
    let r1 = +s[1];
    let r2 = +s[4];

    let res = [];
    for (let i = c1; i <= c2; i++) {
        for (let j = r1; j <= r2; j++) {
            res.push(chars[i] + j);
        }
    }

    return res;
};
console.log(cellsInRange('A1:F1'))
