/**
 * @param {string} s
 * @param {number[]} distance
 * @return {boolean}
 */
var checkDistances = function(s, distance) {
    const A = [];
    let code = 0;
    for (let i = 0; i < s.length; i++) {
        code = s.charCodeAt(i) - 97

        if (A[code] === undefined) {
            A[code] = i;
        } else {
            A[code] = i - A[code] - 1;
        }
    }

    for (let i = 0; i < distance.length; i++) {
        if (A[i] !== undefined && distance[i] !== A[i]) return false;
    }

    return true;
};
