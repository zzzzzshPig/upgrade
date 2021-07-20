/**
 * @param {number} n
 * @return {number}
 */
var countTriples = function(n) {
    let res = 0
    let n2 = n * n

    for (let i = 1; i <= n; i++) {
        for (let j = i + 1; j <= n; j++) {
            let a = i * i + j * j
            if (a <= n2 && Number.isInteger(Math.sqrt(a))) {
                res += 2
            }
        }
    }

    return res
};
console.log(countTriples(250))
