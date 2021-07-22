/**
 * @param {number[][]} mat
 * @return {number}
 */
var numSpecial = function(mat) {
    let res = 0

    for (let i = 0; i < mat.length; i++) {
        let idx = -1

        for (let j = 0; j < mat[i].length; j++) {
            if (mat[i][j] === 0) continue

            if (idx === -1) {
                idx = j
            } else {
                idx = -1
                break
            }
        }

        if (idx === -1) continue

        let j = 0
        for (; j < mat.length; j++) {
            if (j !== i && mat[j][idx] === 1) {
                break
            }
        }

        if (j === mat.length) {
            res++
        }
    }

    return res
};
