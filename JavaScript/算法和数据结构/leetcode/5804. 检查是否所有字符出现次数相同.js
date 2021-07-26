/**
 * @param {string} s
 * @return {boolean}
 */
var areOccurrencesEqual = function(s) {
    let arr = Array.from({length: 26}).fill(0)

    for (let i = 0; i < s.length; i++) {
        arr[s[i].charCodeAt(0) - 97]++
    }

    arr =  arr.filter(a => a)

    return arr.every(a => a === arr[0])
};
console.log(areOccurrencesEqual("vvvvvvvvvvvvvvvvvvv"))
