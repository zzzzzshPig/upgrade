/*
* 给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。
*    3
   / \
  9  20
    /  \
   15   7

* [
  [3],
  [9,20],
  [15,7]
]
* */

function levelOrder (root) {
    if (!root) return []

    const queue = [root]
    const res = []

    while (queue.length) {
        const len = queue.length
        res.push([])
        for (let i = 0; i < len; i++) {
            const s = queue.shift()

            res[res.length - 1].push(s.val)

            if (s.left) {
                queue.push(s.left)
            }

            if (s.right) {
                queue.push(s.right)
            }
        }
    }

    return res
}
console.log(levelOrder({
    val: 3,
    left: {
        val: 9,
        left: null,
        right: null
    },
    right: {
        val: 20,
        left: {
            val: 15,
            left: null,
            right: null
        },
        right: {
            val: 7,
            left: null,
            right: null
        }
    }
}))
