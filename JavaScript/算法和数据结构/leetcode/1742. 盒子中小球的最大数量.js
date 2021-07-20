/**
 * @param {number} lowLimit
 * @param {number} highLimit
 * @return {number}
 */
var countBalls = function(lowLimit, highLimit) {
    const box = Array.from({length: 46}).fill(0)
    let last = getNumSum(lowLimit)
    box[last]++
    lowLimit++

    while (lowLimit <= highLimit) {
        last += 1 - getZero(lowLimit) * 9

        box[last]++

        lowLimit++
    }

    return Math.max(...box)
};

function getZero (num) {
    if (num % 10 !== 0) return 0

    num = num.toString()

    let res = 0

    for (let i = num.length - 1; i >= 0; i--) {
        if (num[i] !== '0') {
            break
        }

        res++
    }

    return res
}

function getNumSum (num) {
    const str = String(num)
    let res = 0

    for (const a of str) {
        res += Number(a)
    }

    return res
}

console.log(countBalls(1, 10))
