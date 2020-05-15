/*
二叉树的前序遍历
给定一个二叉树，返回它的 前序 遍历。
输入: [1,null,2,3]
   1
    \
     2
    /
   3

输出: [1,2,3]

进阶: 递归算法很简单，你可以通过迭代算法完成吗？
* */

function preorderTraversal (root) {
    const right = []
    const res = []

    while (root) {
        res.push(root.val)
        right.push(root.right)

        if (root.left === null) {
            while (right[right.length - 1] === null) {
                right.pop()
            }

            if (right.length === 0) {
                break
            } else {
                root = right[right.length - 1]
                right.pop()
            }
        } else {
            root = root.left
        }
    }

    return res
}
console.log(preorderTraversal({
    val: 1,
    left: {
        val: 2,
        left: {
            val: 4,
            left: null,
            right: {
                val: 5,
                left: null,
                right: {
                    val: 6,
                    left: null,
                    right: null
                }
            }
        },
        right: null
    },
    right: {
        val: 3,
        left: {
            val: 7,
            left: {
                val: 8,
                left: null,
                right: {
                    val: 9,
                    left: null,
                    right: null
                }
            },
            right: null
        },
        right: null
    }
}))
