/**
 * @param {number[][]} mat
 * @param {number[][]} target
 * @return {boolean}
 */
var findRotation = function(mat, target) {
    let m1 = ''
    let m2 = ''
    let m3 = ''
    let m4 = ''
    let m5 = ''
    let n = mat.length
    let nr1 = n - 1

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            m1 += mat[nr1 - j][i]
            m2 += mat[nr1 - i][nr1 - j]
            m3 += mat[j][nr1 - i]
            m4 += mat[i][j]
            m5 += target[i][j]
        }
    }

    return [m1, m2, m3, m4].includes(m5)
};
console.log(findRotation([[0,0,0],[0,0,1],[0,0,1]], [[0,0,0],[0,0,1],[0,0,1]]))
