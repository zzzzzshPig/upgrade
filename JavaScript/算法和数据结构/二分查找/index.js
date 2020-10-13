// 1351. 统计有序矩阵中的负数
var countNegatives = function(grid) {
    let res = 0

    grid.forEach(a => {
        let left = 0
        let right = a.length - 1

        while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2)
            const item = a[mid]

            if (item >= 0) {
                left = mid + 1
            } else if (item < 0) {
                res += right - mid + 1
                right = mid - 1
            }
        }
    })

    return res
}
console.log(countNegatives([[-1]]))
