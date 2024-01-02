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
 * @return {TreeNode}
 */
var expandBinaryTree = function (root) {
  const { left, right } = root;

  if (left) {
    root.left = {
      val: -1,
      left,
      right: null,
    };

    // 继续遍历 left
    expandBinaryTree(left);
  }

  if (right) {
    root.right = {
      val: -1,
      right,
      left: null,
    };

    // 继续遍历 right
    expandBinaryTree(right);
  }

  return root;
};
