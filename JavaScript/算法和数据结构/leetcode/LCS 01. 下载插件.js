/**
 * @param {number} n
 * @return {number}
 */
var leastMinutes = function(n) {
    let a = 1
    let res = 1

    while (a < n) {
        a = a * 2
        res++
    }

    return res
};
console.log(leastMinutes(12345))
