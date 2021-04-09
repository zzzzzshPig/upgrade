/**
 * @param {number} num
 * @return {number}
 */
var numberOfSteps = function(num) {
    num = num.toString(2)
    return num.length - 1 + num.replace(/0/g, '').length
};
