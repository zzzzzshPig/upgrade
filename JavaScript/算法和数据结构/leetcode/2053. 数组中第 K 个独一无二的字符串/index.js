/**
 * @param {string[]} arr
 * @param {number} k
 * @return {string}
 */
var kthDistinct = function(arr, k) {
    const m = {};

    arr.forEach(a => {
        m[a] = m[a] + 1 || 1;
    })

    return arr.filter(a => m[a] === 1)[k - 1] || '';
};
