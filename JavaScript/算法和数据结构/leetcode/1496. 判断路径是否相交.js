/**
 * @param {string} path
 * @return {boolean}
 */
var isPathCrossing = function(path) {
    let arr = ['0,0']
    let point = [0, 0]

    for (let i = 0; i < path.length; i++) {
        if (path[i] === 'N') {
            point[1]++
        } else if (path[i] === 'S') {
            point[1]--
        } else if (path[i] === 'E') {
            point[0]++
        } else if (path[i] === 'W') {
            point[0]--
        }

        console.log(point)

        if (arr.includes(point.toString())) return true

        arr.push(point.toString())
    }

    return false
};
console.log(isPathCrossing('NESWW'))
