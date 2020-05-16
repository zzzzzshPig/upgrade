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
    if (!root) return []

    const stack = [root]
    const res = []

    while (stack.length) {
        const cur = stack.pop()
        res.push(cur.val)

        if (cur.right) {
            stack.push(cur.right)
        }

        if (cur.left) {
            stack.push(cur.left)
        }
    }

    return res
}
// console.log(preorderTraversal({
//     val: 1,
//     left: {
//         val: 2,
//         left: {
//             val: 4,
//             left: null,
//             right: {
//                 val: 5,
//                 left: null,
//                 right: {
//                     val: 6,
//                     left: null,
//                     right: null
//                 }
//             }
//         },
//         right: null
//     },
//     right: {
//         val: 3,
//         left: {
//             val: 7,
//             left: {
//                 val: 8,
//                 left: null,
//                 right: {
//                     val: 9,
//                     left: null,
//                     right: null
//                 }
//             },
//             right: null
//         },
//         right: null
//     }
// }))

/*
给定一个二叉树，返回它的 后序 遍历。
输入: [1,null,2,3]
   1
    \
     2
    /
   3

输出: [3,2,1]
进阶: 递归算法很简单，你可以通过迭代算法完成吗？
* */
function postorderTraversal (root) {
    if (!root) return []

    const stack = [root]
    const res = []

    while (stack.length) {
        const cur = stack.pop()
        res.unshift(cur.val)

        if (cur.left) {
            stack.push(cur.left)
        }

        if (cur.right) {
            stack.push(cur.right)
        }
    }

    return res
}
// console.log(postorderTraversal({
//     val: 1,
//     left: {
//         val: 2,
//         left: null,
//         right: null
//     },
//     right: {
//         val: 3,
//         left: null,
//         right: null
//     }
// }))

/*
给定一个二叉树，返回它的中序 遍历。
输入: [1,null,2,3]
   1
    \
     2
    /
   3

输出: [1,3,2]
进阶: 递归算法很简单，你可以通过迭代算法完成吗？
* */
function inorderTraversal (root) {
    const stack = []
    const res = []
    let cur = root

    while (cur || stack.length) {
        // 先找最左侧节点
        while (cur) {
            stack.push(cur)
            cur = cur.left
        }

        cur = stack.pop()
        res.push(cur.val)
        cur = cur.right
    }

    return res
}
/* console.log(inorderTraversal({
    val: 1,
    left: {
        val: 2,
        left: null,
        right: null
    },
    right: {
        val: 3,
        left: null,
        right: null
    }
})) */

/*
翻转一棵二叉树。
输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1
ps: 如果你做出了这道题，那么你将会比Homebrew的作者 Max Howell 还厉害 (:
* */

function invertTree (root) {
    if (!root) return root;

    [root.left, root.right] = [root.right, root.left]

    invertTree(root.left)
    invertTree(root.right)

    return root
}
console.log(invertTree({
    val: 1,
    left: {
        val: 2,
        left: null,
        right: null
    },
    right: {
        val: 3,
        left: null,
        right: null
    }
}))
