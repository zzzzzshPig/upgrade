/**
 * @param {number[]} arr
 * @return {number[]}
 */
var arrayRankTransform = function(arr) {
    let arr1 = [...arr]

    arr1.sort((a, b) => a - b)

    let hash = {}

    let count = 1

    for (let i = 0; i < arr1.length; i++) {
        if (!hash[arr1[i]]) {
            hash[arr1[i]] = count
            count++
        }
    }

    return arr.map(a => {
        return hash[a]
    })
};
console.log(arrayRankTransform([40, 10, 20, 30]))
