/**
 * @param {number[]} arr
 * @return {number}
 */
var findLucky = function(arr) {
    let hash = {}

    for (let i = 0; i < arr.length; i++) {
        hash[arr[i]] = ++hash[arr[i]] || 1
    }

    let res = -1

    for (const hashKey in hash) {
        if (hash[hashKey] === Number(hashKey)) {
            res = Math.max(hash[hashKey], res)
        }
    }

    return res
};
