/**
 * @param {number[]} nums
 * @param {number[]} queries
 * @return {number[]}
 */
var answerQueries = function(nums, queries) {
    nums.sort((a, b) => a - b)

    const answer = [];

    queries.forEach(q => {
        let s = 0;
        for (let i = 0; i < nums.length; i++) {
            s += nums[i];

            if (s > q) {
                answer.push(i);
                return;
            }
        }

        answer.push(nums.length)
    })

    return answer;
};
