/**
 * @param {number[]} prices
 * @return {number[]}
 */
var finalPrices = function(prices) {
    let min = prices.length
    const res = []

    for (let i = prices.length - 1; i >= 0 ; i--) {
        if (prices[min] <= prices[i]) {
            for (let j = i + 1; j <= min; j++) {
                if (prices[j] <= prices[i]) {
                    res.unshift(prices[i] - prices[j])
                    break
                }
            }
        } else {
            res.unshift(prices[i])
            min = i
        }
    }

    return res
};
console.log(finalPrices([10,1,1,6]))
