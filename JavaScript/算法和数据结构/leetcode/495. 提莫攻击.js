/**
 * @param {number[]} timeSeries
 * @param {number} duration
 * @return {number}
 */
var findPoisonedDuration = function(timeSeries, duration) {
    let res = 0

    for (let i = 0; i < timeSeries.length; i++) {
        if (timeSeries[i + 1] - timeSeries[i] < duration) {
            res += timeSeries[i + 1] - timeSeries[i]
        } else {
            res += duration
        }
    }

    return res
};
