/**
 * @param {number[][]} boxTypes
 * @param {number} truckSize
 * @return {number}
 */
var maximumUnits = function(boxTypes, truckSize) {
    boxTypes.sort((a, b) => {
        return b[1] - a[1]
    })

    let res = 0

    for (let i = 0; i < boxTypes.length; i++) {
        if (truckSize >= boxTypes[i][0]) {
            truckSize -= boxTypes[i][0]
            res += boxTypes[i][1] * boxTypes[i][0]
        } else {
            res += truckSize * boxTypes[i][1]
            break
        }
    }

    return res
};
console.log(maximumUnits([[5,10],[2,5],[4,7],[3,9]], 10))
