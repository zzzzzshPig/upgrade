/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortEvenOdd = function(nums) {
    const l = [];
    const r = [];

    for (let i = 0; i < nums.length; i++) {
        if (i % 2 === 0) {
            l.push(nums[i]);
        } else {
            r.push(nums[i]);
        }
    }

    l.sort((a, b) => a - b);
    r.sort((a, b) => b - a);

    for (let i = 0; i < l.length; i++) {
        const j = i * 2;
        nums[j] = l[i];
        nums[j + 1] = r[i];
    }

    if (nums[nums.length - 1] === undefined) nums.pop();

    return nums;
};
