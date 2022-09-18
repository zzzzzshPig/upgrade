/**
 * @param {number[]} gem
 * @param {number[][]} operations
 * @return {number}
 */
var giveGem = function(gem, operations) {
    operations.forEach(operation => {
        const count = Math.floor(gem[operation[0]] / 2);
        gem[operation[1]] += count;
        gem[operation[0]] -= count;
    })

    let max = -Infinity;
    let min = Infinity;
    gem.forEach(g => {
        if (g > max) {
            max = g;
        } else if (g < min) {
            min = g;
        }
    })
    return max - min;
};
