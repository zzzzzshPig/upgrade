/**
 * @param {number[]} time
 * @param {number[][]} fruits
 * @param {number} limit
 * @return {number}
 */
var getMinimumTime = function(time, fruits, limit) {
    let res = 0;

    fruits.forEach(fruit => {
        res += Math.ceil(fruit[1] / limit) * time[fruit[0]];
    })

    return res;
};
