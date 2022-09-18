/**
 * @param {number[]} nums
 * @return {number}
 */
var countQuadruplets = function(nums) {
    let map = {};

    for (let i = 2; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (map[nums[j] - nums[i]]) {
                map[nums[j] - nums[i]].push(i);
            } else {
                map[nums[j] - nums[i]] = [i];
            }
        }
    }

    let res = 0;
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            const m = map[nums[i] + nums[j]];

            if (m) {
                for (let l = 0; l < m.length; l++) {
                    if (m[l] > j) {
                        res += m.length - l;
                        break;
                    }
                }
            }
        }
    }

    return res;
};
