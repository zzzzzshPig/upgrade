/**
 * @param {string} number
 * @return {string}
 */
var reformatNumber = function(number) {
    let r = ''

    for (let i = 0; i < number.length; i++) {
        if (number[i] !== ' ' && number[i] !== '-') {
            r += number[i]
        }
    }

    let res = ''

    for (let i = 0; i < r.length; i++) {
        if (i % 3 === 0) {
            if (i !== 0) {
                res += '-'
            }

            if (i >= r.length - 4) {
                let l = r.length - i

                if (l === 3 || l === 2) {
                    res += r.slice(i)
                } else {
                    res += r.slice(i, i + 2) + '-' + r.slice(i + 2)
                }

                break
            }
        }

        res += r[i]
    }

    return res
};
console.log(reformatNumber("9964-"))
