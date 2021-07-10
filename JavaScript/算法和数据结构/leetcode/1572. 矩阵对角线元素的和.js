/**
 * @param {number[][]} mat
 * @return {number}
 */
var diagonalSum = function(mat) {
    let x = 0,
        y = mat.length - 1,
        res = 0

    while (x < y) {
        res += mat[x][x] + mat[x][y] + mat[y][x] + mat[y][y]
        x++
        y--
    }

    if (x === y) res += mat[x][x]

    return res
};
