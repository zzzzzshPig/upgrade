/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
var shiftGrid = function(grid, k) {
    let m = grid.length
    let n = grid[0].length
    let x = Math.floor(k / n) % m
    let y = k % n

    while (x) {
        grid.unshift(grid[m - 1])
        grid.pop()

        x--
    }

    if (!y) return grid

    let f = grid[m - 1].slice(n - y, n)

    let i = m - 1
    let j = n - y - 1

    while (i >= 0) {
        let z = j + y

        if (z >= n) {
            grid[i + 1][z - n] = grid[i][j]
        } else {
            grid[i][z] = grid[i][j]
        }

        j--

        if (j < 0) {
            j = n - 1
            i--
        }
    }

    grid[0].splice(0, y, ...f)

    return grid
};
console.log(shiftGrid([[1],[2],[3],[4],[7],[6],[5]], 23))
