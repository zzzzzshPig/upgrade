/**
 * @param {string[]} operations
 * @return {number}
 */
var finalValueAfterOperations = function(operations) {
    let res = 0;

    for (let i = 0; i < operations.length; i++) {
        if (operations[i].includes('+')) {
            res++;
        } else {
            res--;
        }
    }

    return res;
};
