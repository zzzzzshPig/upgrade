const utils = require('util')

function TreeNode (val) {
    this.val = val
    this.left = this.right = null
}

/*
给定一个二叉树，判断其是否是一个有效的二叉搜索树。

假设一个二叉搜索树具有如下特征：

节点的左子树只包含小于当前节点的数。
节点的右子树只包含大于当前节点的数。
所有左子树和右子树自身必须也是二叉搜索树。
*/
function isValidBST (root) {
    function dg (root, min, max) {
        if (!root) return true

        // break
        if (root.val <= min || root.val >= max) return false

        return dg(root.left, min, root.val) && dg(root.right, root.val, max)
    }

    return dg(root, -Infinity, Infinity)
}

/*
将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。
本题中，一个高度平衡二叉树是指一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1。
给定有序数组: [-10,-3,0,5,9],

一个可能的答案是：[0,-3,9,-10,null,5]，它可以表示下面这个高度平衡二叉搜索树：

      0
     / \
   -3   9
   /   /
 -10  5
* */
function sortedArrayToBST (nums) {
    function dg (left, right) {
        if (left < right) {
            const len = Math.floor(left + (right - left) / 2)
            const root = new TreeNode(nums[len])

            root.left = dg(left, len)
            root.right = dg(len + 1, right)

            return root
        }
        return null
    }

    return dg(0, nums.length)
}
console.log(utils.inspect(sortedArrayToBST([1, 3]), { showHidden: false, depth: null }))
