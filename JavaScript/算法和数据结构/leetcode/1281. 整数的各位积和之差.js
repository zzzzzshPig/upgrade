/**
 * @param {number} n
 * @return {number}
 */
var subtractProductAndSum = function(n) {
    n = n.toString()
    let j = +n[0]
    let h = j

    for (let i = 1; i < n.length; i++) {
        let n1 = +n[i]
        j *= n1
        h += n1
    }

    return j - h
};
