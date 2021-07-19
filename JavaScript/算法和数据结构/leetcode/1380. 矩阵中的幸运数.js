/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var luckyNumbers  = function(matrix) {
    const res = []

    matrix.forEach(a => {
        let idx = 0

        // 最小值
        a.forEach((b, i) => {
            if (b < a[idx]) {
                idx = i
            }
        })

        // 最大值
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i][idx] > a[idx]) {
                return
            }
        }

        res.push(a[idx])
    })

    return res
};
console.log(luckyNumbers([[3,7,8],[9,11,13],[15,16,17]]))
