/**
 * @param {number[]} startTime
 * @param {number[]} endTime
 * @param {number} queryTime
 * @return {number}
 */
var busyStudent = function(startTime, endTime, queryTime) {
    let res = 0

    startTime.forEach((a, i) => {
        if (a <= queryTime && endTime[i] >= queryTime) {
            res++
        }
    })

    return res
};
