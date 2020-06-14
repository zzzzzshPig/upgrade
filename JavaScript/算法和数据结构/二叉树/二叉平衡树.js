const { generateTree, TreeNode } = require('./utils')

/*
给定一个二叉树，判断它是否是高度平衡的二叉树。
本题中，一棵高度平衡二叉树定义为：
一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过1。
示例 1:

给定二叉树 [3,9,20,null,null,15,7]

    3
   / \
  9  20
    /  \
   15   7
返回 true 。

示例 2:

给定二叉树 [1,2,2,3,3,null,null,4,4]
* */

/*
*
* 第一种解法 计算高度
function height (root, h = 0) {
    if (!root) return h

    h++
    return Math.max(height(root.left, h), height(root.right, h))
}
function isBalanced (root) {
    if (!root) return true
    else if (Math.abs(height(root.left) - height(root.right)) > 1) return false
    else return isBalanced(root.left) && isBalanced(root.right)
}
console.log(isBalanced(utils.generateTree([1, null, 2, null, 3])))
* */

/*
第二种解法 深度遍历
function isBalanced (root) {
    if (!root) return true

    function dg (r, deep) {
        if (!r) return deep

        const a = dg(r.left, deep + 1)
        const b = dg(r.right, deep + 1)

        if (a === false || b === false || Math.abs(a - b) > 1) return false
        else return Math.max(a, b)
    }

    return !!dg(root, 0)
} */
// console.log(isBalanced(generateTree([1, 2, null, 3, null, 4, null, 5])))

/*
将二叉搜索树变平衡
给你一棵二叉搜索树，请你返回一棵 平衡后 的二叉搜索树，新生成的树应该与原来的树有着相同的节点值。
如果一棵二叉搜索树中，每个节点的两棵子树高度差不超过 1 ，我们就称这棵二叉搜索树是 平衡的 。
如果有多种构造方法，请你返回任意一种。
* */

function balanceBST (root) {
    const mdQ = []

    function md (root) {
        if (!root) return
        md(root.left)
        mdQ.push(root.val)
        md(root.right)
    }

    md(root)

    function dg (l, r) {
        if (l >= r) return null

        const len = l + Math.floor((r - l) / 2)
        const root = new TreeNode(mdQ[len])
        root.left = dg(l, len)
        root.right = dg(len + 1, r)
        return root
    }

    return dg(0, mdQ.length)
}
console.log(balanceBST(generateTree([2, 1, 3, null, null, null, 4])))
