/**
 * @param {number[]} nums
 * @return {number}
 */
var subsetXORSum = function(nums) {
    let res = 0;
    function dfs(i, v) {
        res += v;
        for (i; i < nums.length; i++) {
            dfs(i + 1, v ^ nums[i]);
        }
    }
    dfs(0, 0);
    return res;
};
