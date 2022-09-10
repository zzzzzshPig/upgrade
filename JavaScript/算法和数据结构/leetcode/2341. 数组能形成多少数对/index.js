/**
 * @param {number[]} nums
 * @return {number[]}
 */
var numberOfPairs = function(nums) {
    let ms = Array.from({ length: 101 }).fill(0);

    nums.forEach(num => {
        ms[num]++;
    })

    let res = 0;

    ms.forEach((m) => {
        res += m % 2;
    })

    return [(nums.length - res) / 2, res];
};
