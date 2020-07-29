// N皇后 https://leetcode-cn.com/problems/n-queens/
function solveNQueens (n) {
    const res = []

    // q 需要检查的数组
    // row,col 当前皇后插入的位置
    function isValid (q, row, col) {
        let i
        // 上有木有皇后
        for (i = row - 1; i >= 0; i--) {
            if (q[i][col] === 'Q') {
                return false
            }
        }

        // 左上
        let col1 = col - 1
        for (i = row - 1; i >= 0 && col1 >= 0; i--) {
            if (q[i][col1] === 'Q') {
                return false
            }
            col1--
        }

        // 右上
        col1 = col + 1
        for (i = row - 1; i >= 0 && col1 < n; i--) {
            if (q[i][col1] === 'Q') {
                return false
            }
            col1++
        }

        return true
    }

    dg([], 0)
    function dg (q, row) {
        // break
        if (row === n) {
            res.push(q)
            return
        }

        // 当前row的每个col都有可能是Q
        for (let i = 0; i < n; i++) {
            if (isValid(q, row, i)) {
                dg(q.concat(`${'.'.repeat(i)}Q${'.'.repeat(n - i - 1)}`), row + 1)
            }
        }
    }

    return res
}
// console.log(solveNQueens(9))

// N皇后 II https://leetcode-cn.com/problems/n-queens-ii/submissions/
function totalNQueens (n) {
    let res = 0

    // q 需要检查的数组
    // row,col 当前皇后插入的位置
    function isValid (q, row, col) {
        let i
        // 上有木有皇后
        for (i = row - 1; i >= 0; i--) {
            if (q[i] === col) {
                return false
            }
        }

        // 左上
        let col1 = col - 1
        for (i = row - 1; i >= 0 && col1 >= 0; i--) {
            if (q[i] === col1) {
                return false
            }
            col1--
        }

        // 右上
        col1 = col + 1
        for (i = row - 1; i >= 0 && col1 < n; i--) {
            if (q[i] === col1) {
                return false
            }
            col1++
        }

        return true
    }

    dg([], 0)
    function dg (q, row) {
        // break
        if (row === n) {
            res++
            return
        }

        // 当前row的每个col都有可能是Q
        for (let i = 0; i < n; i++) {
            if (isValid(q, row, i)) {
                dg(q.concat(i), row + 1)
            }
        }
    }

    return res
}

// 二进制手表 https://leetcode-cn.com/problems/binary-watch/
// 这道题还有O(1)解法，我是没有想到的，参考 https://leetcode-cn.com/problems/binary-watch/comments/
function readBinaryWatch (num) {
    const res = []
    const light = [1, 2, 4, 8, 1, 2, 4, 8, 16, 32]

    function addHour (time, h) {
        const t = time.concat()
        t[0] += h
        return t
    }

    function addMinute (time, m) {
        const t = time.concat()
        t[1] += m
        return t
    }

    function isValid (time) {
        return time[0] <= 11 && time[1] <= 59
    }

    // time = [hour, minute]
    function dg (time, index, row) {
        // break
        if (row === num) {
            time[1] < 10 && (time[1] = '0' + time[1])
            res.push(time.join(':'))
            return
        }

        // 当前生成的是小时
        for (index; index < 4; index++) {
            const t = addHour(time, light[index])
            if (isValid(t)) {
                dg(t, index + 1,  row + 1)
            }
        }

        // 当前生成的是分钟
        for (index; index < 10; index++) {
            const t = addMinute(time, light[index])
            if (isValid(t)) {
                dg(t, index + 1, row + 1)
            }
        }
    }

    dg([0, 0], 0, 0)
    return res
}
console.log(readBinaryWatch(4))
