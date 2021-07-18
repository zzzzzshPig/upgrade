/**
 * @param {number[]} arr
 * @return {number[]}
 */
var sortByBits = function(arr) {
    return arr.sort((a, b) => {
        let aa = a.toString(2)
        let bb = b.toString(2)

        let a1 = 0
        let b1 = 0

        for (let i = 0; i < aa.length; i++) {
            if (aa[i] === '1') {
                a1++
            }
        }

        for (let i = 0; i < bb.length; i++) {
            if (bb[i] === '1') {
                b1++
            }
        }

        if (a1 === b1) {
            return a - b
        }

        return a1 - b1
    })
};
console.log(sortByBits([0,1,2,3,4,5,6,7,8]))
