/**
 * @param {number} n
 * @param {number[]} rounds
 * @return {number[]}
 */
var mostVisited = function(n, rounds) {
    let arr = Array.from({ length: n + 1 }).fill(0)
    let start = rounds[0]
    arr[start]++

    for (let i = 1; i < rounds.length; i++) {
        while (start !== rounds[i]) {
            start = start % n === 0 ? 1 : start + 1
            arr[start]++
        }
    }

    let max = Math.max(...arr)
    let res = []

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] === max) {
            res.push(i)
        }
    }

    return res
};
console.log(mostVisited(4, [2,1,2,1,2,1,2,1,2]))
