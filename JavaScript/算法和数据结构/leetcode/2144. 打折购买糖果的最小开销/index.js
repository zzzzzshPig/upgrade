/**
 * @param {number[]} cost
 * @return {number}
 */
var minimumCost = function(cost) {
    cost.sort((a, b) => b - a);

    let res = 0;
    for (let i = 0; i < cost.length; i += 3) {
        res += cost[i] + (cost[i + 1] || 0);
    }

    return res;
};
