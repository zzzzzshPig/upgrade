/**
 * @param {number} n
 * @param {number[][]} relation
 * @param {number} k
 * @return {number}
 */
var numWays = function(n, relation, k) {
    k--
    let rule = []

    // 找A
    relation.forEach(a => {
        if (a[0] === 0) {
            rule.push(a)
        }
    })

    while (k) {
        const r = []

        rule.forEach(a => {
            relation.forEach(b => {
                if (a[1] === b[0]) {
                    r.push(b)
                }
            })
        })

        rule = r
        k--
    }

    return rule.filter(a => a[1] === (n - 1)).length
};
console.log(numWays(5, [[0,2],[2,1],[3,4],[2,3],[1,4],[2,0],[0,4]], 3))
