/**
 * @param {number} num
 * @return {string}
 */
var toHex = function(num) {
    // 0单独处理
    if (num === 0) return '0';

    // 补码
    if (num < 0) num += 2 ** 32;

    let r = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    let res = r[num % 16];
    while (num >= 16) {
        num = Math.floor(num / 16);
        res = r[num % 16] + res;
    }

    return res;
};
