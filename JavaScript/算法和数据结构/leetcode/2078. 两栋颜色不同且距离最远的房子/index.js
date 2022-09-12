/**
 * @param {number[]} colors
 * @return {number}
 */
var maxDistance = function(colors) {
    let res = 0;

    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            if (colors[i] !== colors[j]) res = Math.max(res, j - i);
        }
    }

    return res;
};
