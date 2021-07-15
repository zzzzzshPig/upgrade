/**
 * @param {string} s
 * @return {string}
 */
var sortString = function(s) {
    // 对s进行排序，然后放入map中处理
    let map = Array.from({ length: 26 }).fill(0)
    for (const a of s) {
        map[a.charCodeAt(0) - 97]++
    }
    map = new Map(map.map((a, i) => a && [String.fromCharCode(97 + i), a]).filter(a => a))

    let res = ''

    while (map.size) {
        // 1,2,3
        map.forEach((v, k) => {
            res += k
            v--

            if (v === 0) {
                map.delete(k)
            } else {
                map.set(k, v)
            }
        })

        // 4,5,6
        let r = ''
        map.forEach((v, k) => {
            r += k
            v--

            if (v === 0) {
                map.delete(k)
            } else {
                map.set(k, v)
            }
        })

        res += r.split('').reverse().join('')
    }

    return res
};
console.log(sortString('ahdukahdaklsdnmaskbdakjsdhfkafbahfaskjdasijdh'))
