/**
 * @param {number[]} arr
 * @return {number[]}
 */
// 倒序找最大值即可
var replaceElements = function(arr) {
    let max = -1

    for (let i = arr.length - 1; i >= 0; i--) {
        [max, arr[i]] = [arr[i] > max ? arr[i] : max, max]
    }

    return arr
};
console.log(replaceElements([17,18,5,4,6,1]))
