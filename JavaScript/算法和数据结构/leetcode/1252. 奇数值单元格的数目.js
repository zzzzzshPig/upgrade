/**
 * @param {number} m
 * @param {number} n
 * @param {number[][]} indices
 * @return {number}
 */
var oddCells = function(m, n, indices) {
    const arr = []

    for (;m > 0; m--) {
        const a = []

        for (let i = 0; i < n; i++) {
            a.push(0)
        }

        arr.push(a)
    }

    indices.forEach(a => {
        const row = arr[a[0]]

        row.forEach((a, i) => {
            row[i]++
        })

        arr.forEach(b => {
            b[a[1]]++
        })
    })

    let res = 0

    arr.forEach(a => {
        a.forEach(b => {
            if (b % 2 !== 0) {
                res++
            }
        })
    })

    return res
};
console.log(oddCells(2, 3, [[0,1],[1,1]]))
