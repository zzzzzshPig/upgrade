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

// 1237. 找出给定方程的正整数解
var findSolution = function(customfunction, z) {
    const rule = Array.from({length: z}).map((a, i) => i + 1)
    const res = []

    let left = 1
    let right = rule.length

    while (left <= rule.length && right >= 1) {
        const val = customfunction.f(left, right)

        if (val > z) {
            right--
        } else if (val < z) {
            left++
        } else if (val === z) {
            res.push([left, right])

            if (left !== right) {
                res.push([right, left])
            }

            left++
            right--
        }
    }

    return res
}
