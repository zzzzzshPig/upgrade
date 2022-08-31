/**
 * @param {number} num
 * @return {number}
 */
var minimumSum = function(num) {
    const a = num.toString().split('').sort((a, b) => a - b);

    return Number(a[0] + a[2]) + Number(a[1] + a[3])
};
