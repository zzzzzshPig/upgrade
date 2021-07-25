/**
 * @param {number[][]} points
 * @return {number}
 */
var largestTriangleArea = function(points) {
    let res = 0

    for (let i = 0; i < points.length - 2; i++) {
        for (let j = i + 1; j < points.length - 1; j++) {
            for (let k = j + 1; k < points.length; k++) {
                res = Math.max(res, getArea(points[i], points[j], points[k]))
            }
        }
    }

    return res
};

// 海伦公式
function getArea (x, y, z) {
    let a = Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2))
    let b = Math.sqrt(Math.pow(y[0] - z[0], 2) + Math.pow(y[1] - z[1], 2))
    let c = Math.sqrt(Math.pow(x[0] - z[0], 2) + Math.pow(x[1] - z[1], 2))
    let p = (a + b + c) / 2

    return Math.sqrt(Math.abs(p * (p - a) * (p - b) * (p - c)))
}

console.log(largestTriangleArea([[-35,19],[40,19],[27,-20],[35,-3],[44,20],[22,-21],[35,33],[-19,42],[11,47],[11,37]]))
