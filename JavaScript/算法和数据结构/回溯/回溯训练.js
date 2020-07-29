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
// console.log(readBinaryWatch(4))

// 无重复字符串的排列组合 https://leetcode-cn.com/problems/permutation-i-lcci/
function permutation (S) {
    const res = []

    function dg (select, remain) {
        // break
        if (remain === '') {
            res.push(select)
            return
        }

        for (let i = 0; i < remain.length; i++) {
            dg(select + remain[i], remain.slice(0, i) + remain.slice(i + 1), i + 1)
        }
    }

    dg('', S, 0)
    return res
}
// console.log(permutation('qwert'))

// 括号 https://leetcode-cn.com/problems/bracket-lcci/
function generateParenthesis (n) {
    const res = []

    function dg (left, right, str) {
        // break
        if (left === right && right === n) {
            res.push(str)
            return
        }

        if (left === right) {
            dg(left + 1, right, str + '(')
        } else if (left > right) {
            if (left < n) dg(left + 1, right, str + '(')
            dg(left, right + 1, str + ')')
        }
    }

    dg(0, 0, '')
    return res
}
// console.log(generateParenthesis(6))
