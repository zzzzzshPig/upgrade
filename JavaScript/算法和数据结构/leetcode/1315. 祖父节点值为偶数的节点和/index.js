/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumEvenGrandparent = function(root) {
    if (!root) return 0;
    let res = 0;

    // 奇数 继续递归
    if (root.val % 2 === 0) {
        const left1 = root.left?.left?.val || 0;
        const left2 = root.left?.right?.val || 0;
        const right1 = root.right?.left?.val || 0;
        const right2 = root.right?.right?.val || 0;

        res = left1 + left2 + right1 + right2;
    }

    return res + sumEvenGrandparent(root.left) + sumEvenGrandparent(root.right);
};
