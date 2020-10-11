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
