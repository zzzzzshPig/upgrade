// 111. 二叉树的最小深度
var minDepth = function(root) {
    if (!root) return 0

    let res = 1
    const bfs = [root]

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            // 结束条件
            if (!cur.left && !cur.right) return res

            cur.left && bfs.push(cur.left)
            cur.right && bfs.push(cur.right)
        }

        res++
    }
}

// 752. 打开转盘锁
var openLock = function(deadends, target) {
    const visited = ['0000']
    const bfs = ['0000']
    let res = 0

    function move (str, idx, dir) {
        const s = str[idx]
        const up = s === '0' ? '9' : (Number(s) - 1).toString()
        const down = s === '9' ? '0' : (Number(s) + 1).toString()
        return `${str.slice(0, idx)}${dir === -1 ? up : down}${str.slice(idx + 1)}`
    }

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            // 死锁 跳过
            if (deadends.includes(cur)) continue

            // 找到target 结束
            if (target === cur) return res

            for (let j = 0; j < 4; j++) {
                const up = move(cur, j, -1)
                if (!visited.includes(up)) {
                    bfs.push(up)
                    visited.push(up)
                }

                const down = move(cur, j, 1)
                if (!visited.includes(down)) {
                    bfs.push(down)
                    visited.push(down)
                }
            }
        }

        res++
    }

    return -1
}

// 690. 员工的重要性
// 不存在一个员工对应多个领导的情况，所以不需要记录访问过的员工
var GetImportance = function(employees, id) {
    const bfs = [id]
    let res = 0

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            for (let j = 0; j < employees.length; j++) {
                const employee = employees[j]

                if (employee.id === cur) {
                    res += employee.importance
                    bfs.push(...employee.subordinates)
                    break
                }
            }
        }
    }

    return res
}

// 513. 找树左下角的值
var findBottomLeftValue = function(root) {
    const bfs = [root]

    while (bfs.length) {
        const len = bfs.length
        const res = bfs[0].val

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            cur.left && bfs.push(cur.left)
            cur.right && bfs.push(cur.right)
        }

        if (bfs.length === 0) {
            return res
        }
    }
}

// 1161. 最大层内元素和
var maxLevelSum = function(root) {
    const bfs = [root]
    let res_max = -Infinity
    let res = 1
    let step = 1

    while (bfs.length) {
        const len = bfs.length

        let max = 0
        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()
            max += cur.val

            cur.left && bfs.push(cur.left)
            cur.right && bfs.push(cur.right)
        }

        if (max > res_max) {
            res_max = max
            res = step
        }

        step++
    }

    return res
}

// 429. N叉树的层序遍历
var levelOrder = function(root) {
    if (!root) return []

    const bfs = [root]
    const res = []

    while (bfs.length) {
        const len = bfs.length

        const layer = []
        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            layer.push(cur.val)
            bfs.push(...cur.children)
        }
        res.push(layer)
    }

    return res
}

// 529. 扫雷游戏
var updateBoard = function(board, click) {
    const bfs = [click.join(',')]

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift().split(',')
            const x = +cur[1]
            const y = +cur[0]

            // 地雷
            if (board[y][x] === 'M') {
                board[y][x] = 'X'
                return board
            }

            board[y][x] = 'B' // 标记被点击

            // 计算四周地雷数量
            const b = Math.min(board.length - 1, y + 1)
            const r = Math.min(board[0].length - 1, x + 1)
            const around = []
            let m = 0
            let t = Math.max(0, y - 1)
            for (t; t <= b; t++) {
                let l = Math.max(0, x - 1)

                for (l; l <= r; l++) {
                    if (board[t][l] === 'M') {
                        m++
                    } else if (board[t][l] === 'E') {
                        around.push(`${t},${l}`)
                    }
                }
            }

            board[y][x] = m === 0 ? 'B' : m.toString() // 有地雷则显示数量

            // 四周无雷 则添加进bfs
            if (m === 0) {
                around.forEach(a => {
                    if (!bfs.includes(a)) {
                        bfs.push(a)
                    }
                })
            }
        }
    }

    return board
}

// 199. 二叉树的右视图
var rightSideView = function(root) {
    if (!root) return []

    const bfs = [root]
    const res = [root.val]

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            cur.left && bfs.push(cur.left)
            cur.right && bfs.push(cur.right)
        }

        if (bfs.length) res.push(bfs[bfs.length - 1].val)
    }

    return res
}

// 515. 在每个树行中找最大值
var largestValues = function(root) {
    if (!root) return []

    const bfs = [root]
    const res = [root.val]

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            cur.left && bfs.push(cur.left)
            cur.right && bfs.push(cur.right)
        }

        if (bfs.length) {
            res.push(Math.max(...bfs.map(a => a.val)))
        }
    }

    return res
}

// 1306. 跳跃游戏 III
var canReach = function(arr, start) {
    const bfs = [start]
    const visited = [start]

    while (bfs.length) {
        const len = bfs.length

        for (let i = 0; i < len; i++) {
            const cur = bfs.shift()

            if (arr[cur] === 0) {
                return true
            }

            // i + arr[i]
            const advance = cur + arr[cur]
            if (advance < arr.length && !visited.includes(advance)) {
                visited.push(advance)
                bfs.push(advance)
            }

            const back = cur - arr[cur]
            if (back >= 0 && !visited.includes(back)) {
                visited.push(back)
                bfs.push(back)
            }
        }
    }

    return false
}
