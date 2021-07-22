/**
 * @param {number} n
 * @return {number}
 */
var totalMoney = function(n) {
    // 等差数列求和
    const week = Math.floor(n / 7)
    const sn = week * (28 + (28 + 7 * (week - 1))) / 2
    const r = n % 7

    return sn + r * (week + 1 + week + r) / 2
};
console.log(totalMoney(4))
