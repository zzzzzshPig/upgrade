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

// 1337. 方阵中战斗力最弱的 K 行
// 此题和二分的关系可能不是很大，不使用二分查找是可以的
var kWeakestRows = function(mat, k) {
    // 以1的数量为索引 行号为值
    const rule = {}

    mat.forEach((a, i) => {
        // 使用二分查1有多少个
        let left = 0
        let right = a.length - 1

        while (left <= right) {
            const mid = Math.floor(left + (right - left) / 2)

            if (a[mid] === 1) {
                left = mid + 1
            } else if (a[mid] === 0) {
                right = mid - 1
            }
        }

        if(rule[left]) {
            rule[left].push(i)
        } else {
            rule[left] = [i]
        }
    })

    const res = []
    for (let key in rule) {
        const value = rule[key]

        for (let i = 0; i < value.length; i++) {
            res.push(value[i])

            k--
            if (k === 0) return res
        }
    }
}
console.log(kWeakestRows([[1,1,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,0,0,0],[1,1,1,1,1]], 3))
