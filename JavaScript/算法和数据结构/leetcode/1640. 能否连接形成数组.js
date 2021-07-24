
/**
 * @param {number[]} arr
 * @param {number[][]} pieces
 * @return {boolean}
 */
var canFormArray = function(arr, pieces) {
    for (let i = 0; i < arr.length; i++) {
        let j = 0

        for (; j < pieces.length; j++) {
            if (arr[i] === pieces[j][0]) {
                for (let k = 1; k < pieces[j].length; k++) {
                    i++

                    if (arr[i] !== pieces[j][k]) {
                        return false
                    }
                }

                pieces[j] = []
                break
            }
        }

        if (j === pieces.length) {
            return false
        }
    }

    return true
};
console.log(canFormArray([15, 88], [[88], [15]]))
