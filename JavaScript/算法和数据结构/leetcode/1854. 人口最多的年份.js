/**
 * @param {number[][]} logs
 * @return {number}
 */
var maximumPopulation = function(logs) {
    let max = 0
    let value = logs[0][0]

    for (let i = 1950; i < 2050; i++) {
        if (i >= logs[0][1]) {
            // 死掉了
            logs.shift()
        }

        let m = 0

        for (let a of logs) {
            if (a[0] <= i && a[1] > i) {
                m++
            }
        }

        if (m > max) {
            max = m
            value = i
        }

        if (!logs.length) break
    }

    return value
};
console.log(maximumPopulation([[2033,2034],[2039,2047],[1998,2042],[2047,2048],[2025,2029],[2005,2044],[1990,1992],[1952,1956],[1984,2014]]))
