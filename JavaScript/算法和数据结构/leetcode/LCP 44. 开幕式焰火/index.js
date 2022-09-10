/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var numColor = function(root) {
    dg(root)
    return set.size;
};

const set = new Set();

function dg(root) {
    set.add(root.val);

    if (root.left) dg(root.left)
    if (root.right) dg(root.right)
}
