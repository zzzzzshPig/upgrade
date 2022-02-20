/**
 * https://leetcode-cn.com/problems/partitioning-into-minimum-number-of-deci-binary-numbers/
 * @param {string} n
 * @return {number}
 * 每个位置是1或者0，当对应位数上的值减为0，则取值为0，比如2，则是1，1；20 则是10 10 故最少需要最高位上的值
 */
var minPartitions = function(n) {
    return Math.max(...n.split(''));
};
minPartitions("82734");
