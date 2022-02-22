/**
 * @param {string[]} bank
 * @return {number}
 * https://leetcode-cn.com/problems/number-of-laser-beams-in-a-bank/
 */
var numberOfBeams = function(bank) {
    let res = 0;
    let last = 0;

    bank.forEach(b => {
        let j = 0;

        for(let i = 0; i < b.length; i++) {
            if (b[i] === '1') {
                j++;
            }
        }

        res += last * j;

        if (j) {
            last = j;
        }
    })

    return res;
};
