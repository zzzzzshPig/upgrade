/**
 * @param {number[][]} edges
 * @return {number}
 */
var findCenter = function(edges) {
    const one = edges[0][0]
    const two = edges[0][1]
    const three = edges[1][0]
    const four = edges[1][1]

    if (one === three || one === four) {
        return one
    } else {
        return two
    }
};
console.log(findCenter([[10,1],[10,2],[3,10],[10,4],[5,10],[10,6],[10,7],[8,10],[10,9],[10,11],[12,10],[10,13],[14,10]]))
