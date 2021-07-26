/**
 * @param {number} n
 * @return {string}
 */
var thousandSeparator = function(n) {
    n = n.toString()
    let len = n.length - 1
    let res = n[len]

    for (let i = len - 1; i >= 0; i--) {
        if ((len - i) % 3 === 0) {
            res = '.' + res
        }

        res = n[i] + res
    }

    return res
};
console.log(thousandSeparator(9876543))
