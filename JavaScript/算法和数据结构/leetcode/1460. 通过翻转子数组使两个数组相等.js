/**
 * @param {number[]} target
 * @param {number[]} arr
 * @return {boolean}
 */
var canBeEqual = function(target, arr) {
    // 两数组元素一样 就能通过任意翻转变成一样的
    // 可以排序也可以统计

    const t = {}

    target.forEach(a => {
        t[a] = (t[a] + 1) || 1
    })

    const r = {}

    arr.forEach(a => {
        r[a] = (r[a] + 1) || 1
    })

    for (let k in t) {
        if (!r[k] || t[k] !== r[k]) {
            return false
        }
    }

    return true
};
