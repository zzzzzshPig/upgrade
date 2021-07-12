/**
 * @param {string} s
 * @return {number}
 */
var balancedStringSplit = function(s) {
    let res = 0
    let RNum = 0
    let LNum = 0

    for (let a of s) {
        if (a === 'R') {
            RNum++
        } else {
            LNum++
        }

        if (RNum === LNum) {
            res++
        }
    }

    return res
};
console.log(balancedStringSplit('RLRRLLRLRL'))
