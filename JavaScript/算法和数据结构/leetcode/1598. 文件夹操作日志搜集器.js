/**
 * @param {string[]} logs
 * @return {number}
 */
var minOperations = function(logs) {
    let res = 0

    for (let i = 0; i < logs.length; i++) {
        if (logs[i] === '../') {
            if (res !== 0) {
                res--
            }
        } else if (logs[i] !== './') {
            res++
        }
    }

    return res
};
