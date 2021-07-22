/**
 * @param {number} numBottles
 * @param {number} numExchange
 * @return {number}
 */
var numWaterBottles = function(numBottles, numExchange) {
    let res = numBottles

    while (numBottles >= numExchange) {
        const a = Math.floor(numBottles / numExchange)
        
        res += a

        numBottles = (numBottles % numExchange) + a
    }

    return res
};
