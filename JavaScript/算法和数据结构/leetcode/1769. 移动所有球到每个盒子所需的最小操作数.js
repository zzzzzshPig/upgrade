/**
 * @param {string} boxes
 * @return {number[]}
 * https://leetcode-cn.com/problems/minimum-number-of-operations-to-move-all-balls-to-each-box/
 */
var minOperations = function(boxes) {
    const n = boxes.length;
    let n1 = n - 1;
    let res = Array.from({ length: n }).fill(0);
    let leftOne = 0;
    let rightOne = 0;
    let leftLast = 0;
    let rightLast = 0;

    for (let i = 0; i < n; i++) {
        leftLast = leftOne + leftLast;
        res[i] += leftLast;
        if (boxes[i] === '1') {
            leftOne++;
        }

        rightLast = rightOne + rightLast;
        res[n1 - i] += rightLast;
        if (boxes[n1 - i] === '1') {
            rightOne++;
        }
    }

    return res;
};
minOperations('001011')
