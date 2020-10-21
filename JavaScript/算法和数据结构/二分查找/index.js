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

// 374. 猜数字大小 标准的二分查找，还有三分查找 详细可以查看官方题解
var guessNumber = function(n) {
    let left = 0

    while (left <= n) {
        const mid = Math.floor(left + (n - left) / 2)
        const res = guess(mid)

        if (res === 0) {
            return mid
        } else if (res === -1) {
            n = mid - 1
        } else if (res === 1) {
            left = mid + 1
        }
    }
}

// 1111. 有效括号的嵌套深度
// 语文题 答案不完美 可以优化
var maxDepthAfterSplit = function(seq) {
    const flag = [0]
    const res = [0]

    for (let i = 1; i < seq.length; i++) {
        if (seq[i] === '(') {
            flag.push(flag.length % 2)
            res.push(flag[flag.length - 1])
        } else if (seq[i] === ')') {
            res.push(flag.pop())
        }
    }

    return res
}

// 22. 完全二叉树的节点个数
var countNodes = function(root) {
    if (!root) return 0

    function getLevel (root) {
        if (!root) return 0

        let res = 1

        while (root.left) {
            res++
            root = root.left
        }

        return res
    }

    const left = getLevel(root.left)
    const right = getLevel(root.right)


    if (left === right) {
        return Math.pow(2, left) + countNodes(root.right)
    } else {
        return Math.pow(2, right) + countNodes(root.left)
    }
}

// 230. 二叉搜索树中第K小的元素
var kthSmallest = function(root, k) {
    let res = null
    let count = 0

    function dg (root) {
        if (res !== null || root === null) return

        dg(root.left)

        count++
        if (count === k) res = root.val
        else dg(root.right)
    }

    dg(root)
    return res
}

// 378. 有序矩阵中第K小的元素
// 参考官方教程
var kthSmallest = function(matrix, k) {
    let l = matrix[0][0]
    let r = matrix[matrix.length - 1][matrix.length - 1]

    function check (mid) {
        let i = matrix.length - 1
        let j = 0
        let n = 0

        while (i >= 0 && j < matrix.length) {
            if (matrix[i][j] <= mid) {
                n += i + 1
                j++
            } else {
                i--
            }
        }

        return n >= k
    }

    while (l < r) {
        const mid = l + (r - l >> 1)

        if (check(mid)) {
            r = mid
        } else {
            l = mid + 1
        }
    }

    return l
}

// 1011. 在 D 天内送达包裹的能力
var shipWithinDays = function(weights, D) {
    let left = Math.max(...weights)
    let right = weights.reduce((a, b) => a + b)

    function getCount (mid) {
        let s = 0
        let res = 1
        for (let w of weights) {
            s += w

            if (s > mid) {
                s = w
                res++
            }
        }
        return res
    }

    while (left < right) {
        const mid = left + (right - left >> 1)

        if (getCount(mid) > D) {
            left = mid + 1
        } else {
            right = mid
        }
    }

    return left
}

// 153. 寻找旋转排序数组中的最小值
var findMin = function(nums) {
    let l = 0
    let r = nums.length - 1

    while (l < r) {
        const m = l + (r - l >> 1)

        if (nums[m] > nums[r]) {
            l = m + 1
        } else {
            r = m
        }
    }

    return nums[l]
}
console.log(findMin([2,1]))
