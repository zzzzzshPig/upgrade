/**
 * @param {number[][]} accounts
 * @return {number}
 */
var maximumWealth = function(accounts) {
    let max = 0
    for (let a of accounts) {
        let m = 0
        for (let b of a) {
            m += b
        }

        if (m > max) max = m
    }
    return max
};
