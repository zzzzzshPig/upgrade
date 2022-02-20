/**
 * https://leetcode-cn.com/problems/queries-on-number-of-points-inside-a-circle/
 * @param {number[][]} points
 * @param {number[][]} queries
 * @return {number[]}
 * 暴力破解，用公式即可
 */
var countPoints = function(points, queries) {
    const res = [];

    queries.forEach(q => {
        let i = 0;

        points.forEach(p => {
            if (q[2] >= Math.sqrt(Math.pow(q[0] - p[0], 2) + Math.pow(q[1] - p[1], 2))) {
                i++;
            }
        })

        res.push(i);
    })

    return res;
};
