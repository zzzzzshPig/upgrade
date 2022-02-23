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

var deepestLeavesSum = function(root) {
    let maxDeep = -1;
    let res = 0;

    function dfs(root, deep) {
        if (!root.left && !root.right) {
            if (deep > maxDeep) {
                res = root.val;
                maxDeep = deep;
            } else if (deep === maxDeep) {
                res += root.val;
            }
            return;
        }

        root.left && dfs(root.left);

        root.right && dfs(root.right);
    }

    dfs(root, 0);

    return res;
};
