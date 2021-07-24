/**
 * @param {number} x
 * @param {number} y
 * @param {number[][]} points
 * @return {number}
 */
var nearestValidPoint = function(x, y, points) {
    let mhd = -1

    for (let i = 0; i < points.length; i++) {
        if (points[i][0] === x || points[i][1] === y) {
            if (mhd === -1) {
                mhd = i
                continue
            }

            if (Math.abs(x - points[i][0]) + Math.abs(y - points[i][1]) < Math.abs(x - points[mhd][0]) + Math.abs(y - points[mhd][1])) {
                mhd = i
            }
        }
    }

    return mhd
};
console.log(nearestValidPoint(3, 4, [[1,2],[3,1],[2,4],[2,3],[4,4]]))
