const { generateTree, TreeNode } = require('./utils')

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
