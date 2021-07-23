/**
 * @param {number} n
 * @return {number}
 */
var countLargestGroup = function(n) {
    let arr = Array.from({ length: 37 }).fill(0)

    for (let i = 1; i <= n; i++) {
        let s = 0
        let is = i.toString()

        for (let j = 0; j < is.length; j++) {
            s += Number(is[j])
        }

        arr[s]++
    }

    let m = Math.max(...arr)
    let res = 0

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === m) {
            res++
        }
    }

    return res
};
console.log(countLargestGroup(1234))
