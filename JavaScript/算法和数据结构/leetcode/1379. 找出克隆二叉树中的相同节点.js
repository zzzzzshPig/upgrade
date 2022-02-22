/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} original
 * @param {TreeNode} cloned
 * @param {TreeNode} target
 * @return {TreeNode}
 * https://leetcode-cn.com/problems/find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree/
 */

var getTargetCopy = function(original, cloned, target) {
    if (original === null) return null;

    if (original === target) {
        return cloned;
    } else {
        return getTargetCopy(original.left, cloned.left, target) || getTargetCopy(original.right, cloned.right, target);
    }
};
