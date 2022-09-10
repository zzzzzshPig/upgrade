/**
 * @param {string} num
 * @return {boolean}
 */
var digitCount = function(num) {
    let ts = Array.from({ length: 10 }).fill(0);

    for (let i = 0; i < num.length; i++) {
        ts[num[i]]++
    }

    for (let i = 0; i < num.length; i++) {
        if (ts[i] != num[i]) return false;
    }

    return true;
};
