/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
    let al = a.length - 1
    let bl = b.length - 1
    let add = 0
    let res = ''

    while (al >= 0 || bl >= 0) {
        let sum = Number(a[al] || 0) + Number(b[bl] || 0) + add

        if (sum >= 2) {
            add = 1
            sum %= 2
        } else {
            add = 0
        }

        res = sum + res
        bl--
        al--
    }

    return add ? add + res : res
};
console.log(addBinary('101001010101011010101010101011010101010101010110101010101010110', '1'))
